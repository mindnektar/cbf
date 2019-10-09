import clone from 'clone';
import generateStates from '../../shared/helpers/generateStates';
import randomizer from '../../shared/helpers/randomizer';
import transaction from './helpers/transaction';
import subscription from './helpers/subscription';
import generateRandomSeed from '../helpers/generateRandomSeed';
import { IllegalArgumentError } from '../errors';
import Match from '../models/Match';
import MatchMessage from '../models/MatchMessage';
import MatchOption from '../models/MatchOption';
import MatchParticipant from '../models/MatchParticipant';
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
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .returning('*')
                    .insert({
                        handle: input.handle,
                        creator_user_id: auth.id,
                    })
                    .first();

                await MatchParticipant.query(trx).insert({
                    match_id: match.id,
                    user_id: auth.id,
                    confirmed: true,
                });

                return match.$graphqlLoadRelated(trx, info);
            })
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

                await MatchParticipant.query(trx).insert(input.players.map((id) => ({
                    match_id: match.id,
                    user_id: id,
                })));

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
                const match = await Match.query(trx).eager('[participants, options]').findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.participants.some(({ userId }) => userId === auth.id)
                    || (
                        match.participants.length === match.options
                            .find(({ type }) => type === 'num-players')
                            .values
                            .reduce((result, current) => (
                                current > result ? current : result
                            ), 0)
                    )
                ) {
                    throw new IllegalArgumentError();
                }

                await MatchParticipant.query(trx).insert({
                    match_id: match.id,
                    user_id: auth.id,
                    confirmed: true,
                });

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('playerJoined', result);

                return result;
            })
        ),
        confirmInvitation: (parent, { id }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[participants.player]')
                    .findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || !match.participants.some(({ player }) => player.id === auth.id)
                ) {
                    throw new IllegalArgumentError();
                }

                await MatchParticipant.query(trx)
                    .findById([match.id, auth.id])
                    .patch({ confirmed: true });

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('invitationConfirmed', result);

                return result;
            })
        ),
        declineInvitation: (parent, { id }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[participants.player]')
                    .findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || !match.participants.some(({ player }) => player.id === auth.id)
                ) {
                    throw new IllegalArgumentError();
                }

                await MatchParticipant.query(trx).deleteById([match.id, auth.id]);

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('invitationDeclined', result);

                return result;
            })
        ),
        removePlayerFromMatch: (parent, { input }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[participants.player]')
                    .findById(input.id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.creatorUserId !== auth.id
                    || !match.participants.some(({ player }) => player.id === input.userId)
                ) {
                    throw new IllegalArgumentError();
                }

                await MatchParticipant.query(trx).deleteById([match.id, input.userId]);

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('removedPlayerFromMatch', result);

                return result;
            })
        ),
        startMatch: (parent, { id }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx).eager('[participants, options]').findById(id);

                if (
                    !match
                    || match.status !== Match.STATUS.OPEN
                    || match.creatorUserId !== auth.id
                    || (
                        !match.options
                            .find(({ type }) => type === 'num-players')
                            .values
                            .includes(match.participants.length)
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
                    .eager('[participants.player, actions.player]')
                    .findById(input.id);

                if (
                    !match
                    || match.status !== Match.STATUS.ACTIVE
                    || !match.participants.some(({ player }) => player.id === auth.id)
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
                    const { player } = match.participants.find((participant) => (
                        participant.player.id === auth.id
                    ));
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
                        state: clone(currentState),
                        payload,
                        player,
                        allPlayers: match.participants.map((participant) => participant.player),
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
                        state: clone(currentState),
                        allPlayers: match.participants.map((participant) => participant.player),
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
                    await Promise.all((
                        action.getScores({ state: currentState }).map(async (player) => {
                            await MatchParticipant.query(trx)
                                .findById([match.id, player.id])
                                .patch({
                                    values: player.scores,
                                    awaits_action: false,
                                });
                        })
                    ));
                    await match.$query(trx).patch({ status: 'FINISHED' });
                } else {
                    await Promise.all((
                        match.participants.map(async (participant) => {
                            await participant.$query(trx).patch({
                                awaits_action: currentState.activePlayers
                                    .includes(participant.player.id),
                            });
                        })
                    ));
                }

                await Action.query(trx).insert(newActions);

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('actionsPushed', result);

                return result;
            })
        ),
        createMessage: (parent, { input }, { auth, pubsub }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[participants.player]')
                    .findById(input.id);

                if (!match || !match.participants.some(({ player }) => player.id === auth.id)) {
                    throw new IllegalArgumentError();
                }

                const message = await MatchMessage.query(trx).returning('*').insert({
                    match_id: match.id,
                    user_id: auth.id,
                    text: input.text,
                });

                await MatchParticipant.query(trx)
                    .where('match_id', match.id)
                    .where('user_id', auth.id)
                    .patch({ last_read_message_id: message.id });

                const result = await match.$graphqlLoadRelated(trx, info);

                pubsub.publish('messageCreated', result);

                return result;
            })
        ),
        markMessagesRead: (parent, { id }, { auth }, info) => (
            transaction(async (trx) => {
                const match = await Match.query(trx)
                    .eager('[participants.player, messages]')
                    .findById(id);

                if (!match || !match.participants.some(({ player }) => player.id === auth.id)) {
                    throw new IllegalArgumentError();
                }

                await MatchParticipant.query(trx)
                    .where('match_id', match.id)
                    .where('user_id', auth.id)
                    .patch({
                        last_read_message_id: (
                            match.messages.length > 0 ? match.messages[0].id : null
                        ),
                    });

                return match.$graphqlLoadRelated(trx, info);
            })
        ),
    },
    Subscription: {
        ...subscription('matchOpened', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        )),
        ...subscription('playerJoined', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        )),
        ...subscription('invitationConfirmed', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        )),
        ...subscription('invitationDeclined', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        )),
        ...subscription('removedPlayerFromMatch', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        )),
        ...subscription('matchStarted', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        )),
        ...subscription('actionsPushed', async (payload, variables, context, info) => (
            Match.query().findById(payload.id).graphqlEager(info)
        ), async (payload, variables, { auth }) => {
            const match = await Match.query().findById(payload.id).eager('participants');

            return match.participants.some(({ userId }) => userId === auth.id);
        }),
        ...subscription('messageCreated', (payload, variables, context, info) => (
            Match.fromJson(payload).$graphqlLoadRelated(info)
        ), async (payload, variables, { auth }) => {
            const match = await Match.query().findById(payload.id).eager('participants');

            return match.participants.some(({ userId }) => userId === auth.id);
        }),
    },
};
