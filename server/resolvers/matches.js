import generateStates from '../../shared/helpers/generateStates';
import transaction from './helpers/transaction';
import subscription from './helpers/subscription';
import generateRandomSeed from '../helpers/generateRandomSeed';
import Match from '../models/Match';
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
        openMatch: (parent, { id }, { auth }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.SETTING_UP
                    || match.creatorUserId !== auth.id
                ) {
                    return {};
                }

                await match.$query(trx).patch({ status: Match.STATUS.OPEN });

                return match.$graphqlLoadRelated(trx, info);
            })
        ),
        joinMatch: (parent, { id }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).eager('players').findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.players.some((player) => player.id === auth.id)
                ) {
                    return {};
                }

                await match.$relatedQuery('players', trx).relate(auth.id);

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('playerJoined', result);

                return result;
            })
        ),
        startMatch: (parent, { id }, { auth }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).eager('players').findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.creatorUserId !== auth.id
                ) {
                    return {};
                }

                const setupAction = require(`../../shared/games/${match.handle}/actions/SETUP`);

                await match.$query(trx).patch({
                    status: Match.STATUS.ACTIVE,
                });

                await Action.query(trx).insert({
                    index: 0,
                    match_id: match.id,
                    random_seed: generateRandomSeed(),
                    type: setupAction.id,
                });

                return match.$graphqlLoadRelated(trx, info);
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
                    return {};
                }

                const actions = require(`../../shared/games/${match.handle}/actions`);
                const states = require(`../../shared/games/${match.handle}/states`);
                const allStates = generateStates(match);
                let stateIndex = allStates.length - 1;
                let currentState = allStates.pop();
                const { activePlayers } = currentState;

                if (!activePlayers.includes(auth.id)) {
                    return {};
                }

                const newActions = input.actions.map(({ type, payload }) => {
                    const action = actions.findById(type);
                    const player = match.players.find(({ id }) => id === auth.id);
                    const isValid = action.isValid({
                        state: currentState,
                        player,
                        payload,
                    });

                    if (!isValid) {
                        throw new Error(`Invalid action: ${action.id}`);
                    }

                    const randomSeed = action.isServerAction ? generateRandomSeed() : null;

                    currentState = action.perform({
                        state: currentState,
                        payload,
                        player,
                        allPlayers: match.players,
                        randomSeed,
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
                    const action = states.findById(currentState.state).performAutomatically();

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
                        randomSeed,
                    });

                    stateIndex += 1;

                    newActions.push({
                        match_id: match.id,
                        index: stateIndex,
                        random_seed: randomSeed,
                        type: action.id,
                    });
                }

                const actionResult = await Action.query(trx).insert(newActions);

                pubsub.publish('actionsPushed', actionResult);

                return match.$graphqlLoadRelated(trx, info);
            })
        ),
    },
    Subscription: {
        ...subscription('playerJoined', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info, { players: {} })
        ), async (payload, variables, { auth }) => (
            payload.players.some(({ id }) => id === auth.id)
        )),
        ...subscription('actionsPushed', (payload, variables, context, info) => (
            Match.query().findById(payload[0].matchId).graphqlEager(info)
        ), async (payload, variables, { auth }) => {
            const match = await Match.query().findById(payload[0].matchId).eager('players');

            return match.players.some(({ id }) => id === auth.id);
        }),
    },
};
