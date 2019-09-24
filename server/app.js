import path from 'path';
import cors from 'cors';
import pg from 'pg';
import expressJwt from 'express-jwt';
import { GraphQLServer } from 'graphql-yoga';
import { mergeTypes, mergeResolvers, fileLoader } from 'merge-graphql-schemas';
import aliasResolver from './middleware/graphql/aliasResolver';
import resolveTokens from './middleware/express/resolveTokens';
import tokenErrorHandler from './middleware/express/tokenErrorHandler';
import config from '../config';

// postgres returns decimal types as strings because the values could potentially become larger than
// fit into a JS variable. it is suggested to parse them to float manually if it is certain that the
// values can never become so large: https://github.com/brianc/node-postgres/issues/811
pg.types.setTypeParser(1700, (value) => parseFloat(value));

const ALLOWED_JWT_ALGORITHMS = ['HS256', 'HS384', 'HS512'];

const graphqlContextResolver = async ({ request }) => ({
    auth: request.auth,
    tokenExpired: request.tokenExpired,
});

const server = new GraphQLServer({
    typeDefs: mergeTypes(fileLoader(path.join(__dirname, 'typeDefs'))),
    resolvers: mergeResolvers(fileLoader(path.join(__dirname, 'resolvers/!(*.test).js'))),
    middlewares: [aliasResolver],
    context: graphqlContextResolver,
});

server.express.use(
    cors(),
    expressJwt({
        secret: config.jwt.secret,
        credentialsRequired: false,
        algorithms: ALLOWED_JWT_ALGORITHMS,
    }),
    tokenErrorHandler,
    resolveTokens,
);

const options = {
    port: config.port.express,
    formatError: (error) => {
        if (error.originalError) {
            const { isCustomError, ...originalError } = error.originalError;
            return isCustomError ? { ...originalError, message: error.message } : error;
        }
        return error;
    },
    formatResponse: (response) => response,
    playground: false,
};

server.start(
    options,
    () => console.log(`Server is running on http://localhost:${config.port.express}`),
);
