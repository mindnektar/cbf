import transaction from './helpers/transaction';
import Announcement from '../models/Announcement';

export default {
    Query: {
        announcements: (parent, params, context, info) => (
            Announcement.query().graphqlEager(info)
        ),
    },
    Mutation: {
        createAnnouncement: (parent, { input }, { auth }, info) => (
            transaction(async (trx) => (
                Announcement.query(trx)
                    .returning('*')
                    .insert({
                        title: input.title,
                        text: input.text,
                        author_user_id: auth.id,
                    })
                    .first()
                    .graphqlEager(info)
            ))
        ),
        updateAnnouncement: (parent, { input }, context, info) => (
            transaction(async (trx) => (
                Announcement.query(trx)
                    .graphqlEager(info)
                    .upsertGraphAndFetch(input)
            ))
        ),
        deleteAnnouncement: (parent, { id }, context, info) => (
            transaction(async (trx) => (
                Announcement.query(trx)
                    .deleteById(id)
                    .returning('*')
                    .graphqlEager(info)
            ))
        ),
    },
};
