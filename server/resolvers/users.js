import bcrypt from '../services/bcrypt';
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

            if (!user) {
                return {};
            }

            if (!bcrypt.compare(input.password, user.passwordHash)) {
                return {};
            }

            return {
                authToken: await user.generateAuthToken(),
            };
        },
        signup: async (parent, { input: { password, ...input } }) => {
            const user = await User.query().insert({
                ...input,
                passwordHash: await bcrypt.hash(password),
            });

            return {
                authToken: await user.generateAuthToken(),
            };
        },
    },
};
