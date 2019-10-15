import transaction from './helpers/transaction';
import bcrypt from '../services/bcrypt';
import generateRandomSeed from '../helpers/generateRandomSeed';
import { InvalidCredentialsError, IllegalArgumentError } from '../errors';
import User from '../models/User';

export default {
    Query: {
        users: (parent, params, context, info) => (
            User.query().orderBy('name').graphqlEager(info)
        ),
        me: (parent, params, { auth }, info) => (
            auth.id ? User.query().findById(auth.id).graphqlEager(info) : null
        ),
    },
    Mutation: {
        login: async (parent, { input }) => {
            const user = await User.query().where('name', input.name).first();

            if (!user || !user.active || !bcrypt.compare(input.password, user.passwordHash)) {
                throw new InvalidCredentialsError();
            }

            await user.updateRenewalToken();

            return {
                authToken: await user.generateAuthToken(),
                renewalToken: await user.signRenewalToken(),
            };
        },
        confirmUser: async (parent, { input }, context, info) => {
            const user = await User.query()
                .where('invite_code', input.inviteCode)
                .where('name', input.name)
                .whereNull('email')
                .patch({
                    email: input.email,
                    passwordHash: await bcrypt.hash(input.password),
                })
                .first()
                .returning('*')
                .graphqlEager(info);

            if (!user) {
                throw new IllegalArgumentError();
            }

            await user.updateRenewalToken();

            return {
                authToken: await user.generateAuthToken(),
                renewalToken: await user.signRenewalToken(),
            };
        },
        createUser: async (parent, { input }, context, info) => (
            User.query()
                .insert({
                    ...input,
                    inviteCode: generateRandomSeed(),
                })
                .returning('*')
                .graphqlEager(info)
        ),
        renewToken: (_, { input }) => (
            transaction(async (trx) => {
                const data = await User.verifyRenewalToken(input.renewalToken);
                const user = await User.query(trx).findById(data.id);

                if (!user || !(await bcrypt.compare(data.token, user.renewalToken))) {
                    throw new IllegalArgumentError();
                }

                await user.updateRenewalToken(trx);

                return {
                    authToken: await user.generateAuthToken(),
                    renewalToken: await user.signRenewalToken(),
                };
            })
        ),
    },
};
