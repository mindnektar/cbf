import uuid from 'uuid';
import transaction from './helpers/transaction';
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
        joinMatch: (parent, { id }, { auth }, info) => (
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

                return match.$graphqlLoadRelated(trx, info);
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
                    random_seed: uuid().substring(0, 4),
                    type: setupAction.id,
                });

                return match.$graphqlLoadRelated(trx, info);
            })
        ),
    },
};
