import generateStates from '../../shared/helpers/generateStates';
import randomizer from '../../shared/helpers/randomizer';
import transaction from './helpers/transaction';
import subscription from './helpers/subscription';
import generateRandomSeed from '../helpers/generateRandomSeed';
import { IllegalArgumentError } from '../errors';
import Match from '../models/Match';
import MatchMessage from '../models/MatchMessage';
import MatchOption from '../models/MatchOption';
import MatchScore from '../models/MatchScore';
import Action from '../models/Action';

export default {
    Query: {
        match: (parent, { id }, context, info) => (
            Match.query().findById(id).graphqlEager(info)
        ),
        matches: (parent, { filter }, context, info) => (
            Match.query().filter(filter).graphqlEager(info)
        ),
    },
    Mutation: {
        createMatch: (parent, { input }, { auth }, info) => (
            transaction((trx) => (
                Match.query(trx).graphqlEager(info).insertGraph({
                    handle: input.handle,
                    creator: {
                        id: auth.id,
                    },
                    players: [{
                        id: auth.id,
                    }],
                }, {
                    relate: true,
                })
            ))
        ),
        openMatch: (parent, { input }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).findById(input.id);

                if (
                    !match
                    || match.status !== Match.STATUS.SETTING_UP
                    || match.creatorUserId !== auth.id
                ) {
                    throw new IllegalArgumentError();
                }

                await match.$query(trx).patch({ status: Match.STATUS.OPEN });

                await MatchOption.query(trx).insert(input.options.map((option) => ({
                    match_id: match.id,
                    type: option.type,
                    values: option.values,
                })));

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('matchOpened', result);

                return result;
            })
        ),
        joinMatch: (parent, { id }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).eager('[players, options]').findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.players.some((player) => player.id === auth.id)
                    || (
                        match.players.length === match.options
                            .find(({ type }) => type === 'num-players')
                            .values
                            .reduce((result, current) => (
                                current > result ? current : result
                            ), 0)
                    )
                ) {
                    throw new IllegalArgumentError();
                }

                await match.$relatedQuery('players', trx).relate(auth.id);

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('playerJoined', result);

                return result;
            })
        ),
        startMatch: (parent, { id }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).eager('[players, options]').findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.creatorUserId !== auth.id
                    || (
                        !match.options
                            .find(({ type }) => type === 'num-players')
                            .values
                            .includes(match.players.length)
                    )
                ) {
                    throw new IllegalArgumentError();
                }

                const setupAction = require(`../../shared/games/${match.handle}/actions/SETUP`);

                await match.$query(trx).patch({ status: Match.STATUS.ACTIVE });

                await Action.query(trx).insert({
                    index: 0,
                    match_id: match.id,
                    random_seed: generateRandomSeed(),
                    type: setupAction.id,
                });

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('matchStarted', result);

                return result;
            })
        ),
        pushActions: (parent, { input }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[players, actions.player]')
                    .findById(input.id);

                if (
                    !match
                    || match.status !== Match.STATUS.ACTIVE
                    || !match.players.some(({ id }) => id === auth.id)
                ) {
                    throw new IllegalArgumentError();
                }

                const actions = require(`../../shared/games/${match.handle}/actions`);
                const states = require(`../../shared/games/${match.handle}/states`);
                const allStates = generateStates(match);
                let stateIndex = allStates.length - 1;
                let currentState = allStates.pop();
                const { activePlayers } = currentState;

                if (!activePlayers.includes(auth.id)) {
                    throw new IllegalArgumentError();
                }

                let action;

                const newActions = input.actions.map(({ type, payload }) => {
                    action = actions.findById(type);
                    const player = match.players.find(({ id }) => id === auth.id);
                    const isValid = action.isValid({
                        state: currentState,
                        player,
                        payload,
                    });

                    if (!isValid) {
                        throw new IllegalArgumentError(`Invalid action: ${action.id}`);
                    }

                    const randomSeed = action.isServerAction ? generateRandomSeed() : null;

                    currentState = action.perform({
                        state: currentState,
                        payload,
                        player,
                        allPlayers: match.players,
                        randomizer: randomSeed ? randomizer(randomSeed) : null,
                    });

                    stateIndex += 1;

                    return {
                        match_id: match.id,
                        index: stateIndex,
                        user_id: auth.id,
                        random_seed: randomSeed,
                        type,
                        payload,
                    };
                });

                while (states.findById(currentState.state).performAutomatically) {
                    action = states.findById(currentState.state).performAutomatically();

                    if (!action.isValid({ state: currentState })) {
                        throw new Error(`Invalid action: ${action}`);
                    }

                    if (action.isEndGameAction) {
                        break;
                    }

                    const randomSeed = action.isServerAction ? generateRandomSeed() : null;

                    currentState = action.perform({
                        state: currentState,
                        allPlayers: match.players,
                        randomizer: randomSeed ? randomizer(randomSeed) : null,
                    });

                    stateIndex += 1;

                    newActions.push({
                        match_id: match.id,
                        index: stateIndex,
                        random_seed: randomSeed,
                        type: action.id,
                    });
                }

                if (action.isEndGameAction) {
                    await MatchScore.query(trx).insert((
                        action.getScores({ state: currentState }).map((player) => ({
                            match_id: match.id,
                            user_id: player.id,
                            values: player.scores,
                        }))
                    ));
                    await match.$query(trx).patch({ status: 'FINISHED' });
                }

                await Action.query(trx).insert(newActions);

                pubsub.publish('actionsPushed', match);

                return match.$graphqlLoadRelated(trx, info);
            })
        ),
        createMessage: (parent, { input }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[players]')
                    .findById(input.id);

                if (!match || !match.players.some(({ id }) => id === auth.id)) {
                    throw new IllegalArgumentError();
                }

                await MatchMessage.query(trx).insert({
                    match_id: match.id,
                    user_id: auth.id,
                    text: input.text,
                });

                pubsub.publish('messageCreated', match);

                return match.$graphqlLoadRelated(trx, info);
            })
        ),
    },
    Subscription: {
        ...subscription('matchOpened', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        ), async (payload, variables, { auth }) => (
            payload.authorUserId !== auth.id
        )),
        ...subscription('playerJoined', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info, { players: {} })
        ), async (payload, variables, { auth }) => (
            payload.players.some(({ id }) => id === auth.id)
        )),
        ...subscription('matchStarted', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info, { players: {} })
        ), async (payload, variables, { auth }) => (
            payload.players.some(({ id }) => id === auth.id)
        )),
        ...subscription('actionsPushed', (payload, variables, context, info) => (
            Match.query().findById(payload.id).graphqlEager(info)
        ), async (payload, variables, { auth }) => {
            const match = await Match.query().findById(payload.id).eager('players');

            return match.players.some(({ id }) => id === auth.id);
        }),
        ...subscription('messageCreated', (payload, variables, context, info) => (
            Match.query().findById(payload.id).graphqlEager(info)
        ), async (payload, variables, { auth }) => {
            const match = await Match.query().findById(payload.id).eager('players');

            return match.players.some(({ id }) => id === auth.id);
        }),
    },
};
