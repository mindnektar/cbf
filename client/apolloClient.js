import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import gql from 'graphql-tag';
import fetch from 'unfetch';
import BaseModel from 'react-apollo-models';
import {
    getToken,
    setToken,
    deleteToken,
    AUTH_TYPE_USER,
    AUTH_TYPE_NONE,
    RENEWAL_TYPE_USER,
} from 'auth';
import { resolvers, typeDefs } from './apolloClient/resolvers';

const cache = new InMemoryCache({
    dataIdFromObject: (object) => object.id,
});

const client = new ApolloClient({
    link: split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        new WebSocketLink({
            uri: window.appConfig.apiUrlWs,
            options: {
                lazy: true,
                reconnect: true,
                connectionParams: () => {
                    const token = getToken(AUTH_TYPE_USER);

                    if (token) {
                        return {
                            Authorization: `Bearer ${token}`,
                        };
                    }

                    return {};
                },
            },
        }),
        ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.forEach(async ({ name, message, locations, path }) => {
                        if (name) {
                            if (name === 'TokenExpiredError') {
                                const renewalToken = getToken(RENEWAL_TYPE_USER);

                                if (!renewalToken) {
                                    deleteToken(AUTH_TYPE_USER);
                                    return;
                                }

                                try {
                                    const { data } = await client.mutate({
                                        mutation: gql`
                                            mutation renewToken($input: RenewTokenInput!) {
                                                renewToken(input: $input) {
                                                    authToken
                                                    renewalToken
                                                }
                                            }
                                        `,
                                        variables: {
                                            input: { renewalToken },
                                        },
                                        context: {
                                            authType: AUTH_TYPE_NONE,
                                        },
                                    });

                                    setToken(AUTH_TYPE_USER, data.renewToken.authToken);
                                    setToken(RENEWAL_TYPE_USER, data.renewToken.renewalToken);
                                } catch (error) {
                                    deleteToken(AUTH_TYPE_USER);
                                    deleteToken(RENEWAL_TYPE_USER);
                                }

                                window.location.reload();
                            }

                            console.log(`[Custom error]: Name: ${name}, Message: ${message}`);
                        } else {
                            console.log(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`);
                        }
                    });
                }

                if (networkError) {
                    console.log('[Network error]:', networkError);
                }
            }),
            setContext((_, context) => {
                const token = context.authType === AUTH_TYPE_NONE
                    ? null
                    : getToken(context.authType);
                const headers = { ...context.headers };

                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                return { ...context, headers };
            }),
            new HttpLink({
                uri: window.appConfig.apiUrl,
                fetch,
            }),
        ]),
    ),
    cache,
    typeDefs,
    resolvers,
});

BaseModel.configure({
    client,
    context: {
        authType: AUTH_TYPE_USER,
    },
});

export default client;
