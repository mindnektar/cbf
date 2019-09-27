import bcrypt from '../services/bcrypt';
import generateRandomSeed from '../helpers/generateRandomSeed';
import User from '../models/User';

export default {
    Query: {
        users: (parent, params, context, info) => (
            User.query().graphqlEager(info)
        ),
        me: (parent, params, { auth }, info) => (
            User.query().findById(auth.id).graphqlEager(info)
        ),
    },
    Mutation: {
        login: async (parent, { input }) => {
            const user = await User.query().where('name', input.name).first();

            if (!user || !user.active) {
                return {};
            }

            if (!bcrypt.compare(input.password, user.passwordHash)) {
                return {};
            }

            return {
                authToken: await user.generateAuthToken(),
            };
        },
        confirmUser: async (parent, { input }, context, info) => (
            User.query()
                .where('invite_code', input.inviteCode)
                .where('name', input.name)
                .patch({
                    email: input.email,
                    passwordHash: await bcrypt.hash(input.password),
                })
                .first()
                .returning('*')
                .graphqlEager(info)
        ),
        createUser: async (parent, { input }, context, info) => (
            User.query()
                .insert({
                    ...input,
                    inviteCode: generateRandomSeed(),
                })
                .returning('*')
                .graphqlEager(info)
        ),
    },
};
