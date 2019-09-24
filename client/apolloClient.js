import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { withClientState } from 'apollo-link-state';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import fetch from 'unfetch';
import BaseModel from 'react-apollo-models';
import history from 'browserHistory';
import {
    getToken,
    deleteToken,
    AUTH_TYPE_USER,
    AUTH_TYPE_NONE,
} from 'auth';
import clientState from './apolloClient/clientState';

const cache = new InMemoryCache({
    addTypename: false,
    dataIdFromObject: (object) => object.id,
});

const client = new ApolloClient({
    link: split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        new WebSocketLink({
            uri: 'http://localhost:5051',
            options: {
                lazy: true,
                reconnect: true,
                connectionParams: () => ({
                    Authorization: `Bearer ${getToken(AUTH_TYPE_USER)}`,
                }),
            },
        }),
        ApolloLink.from([
            withClientState({
                cache,
                ...clientState,
            }),
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.forEach(({ name, message, locations, path }) => {
                        if (name) {
                            if (name === 'TokenExpiredError' || name === 'AuthorizationRequiredError') {
                                deleteToken();
                                history.push('');
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
                uri: 'http://localhost:5051',
                fetch,
            }),
        ]),
    ),
    cache,
});

BaseModel.configure({
    client,
    context: {
        authType: AUTH_TYPE_USER,
    },
});

export default client;
