import gql from 'graphql-tag';
import generateStates from 'shared/helpers/generateStates';

export const typeDefs = gql`
    extend type Mutation {
        performAction(input: PerformActionInput!): Match!
        goToAction(input: GoToActionInput!): Match!
    }

    extend type Match {
        states: JSON!
        stateIndex: Int!
        stateCountSinceLastLoad: Int!
        globalParams: JSON!
        historyMode: Boolean!
    }

    input PerformActionInput {
        id: ID!
        action: ActionInput!
        state: JSON!
    }

    input ActionInput {
        type: Int!
        payload: JSON
        player: PlayerInput!
    }

    input PlayerInput {
        id: ID!
        name: String!
    }

    input GoToActionInput {
        id: ID!
        index: Int!
        historyMode: Boolean
    }
`;

export const resolvers = {
    Mutation: {
        performAction: (parent, { input }, { cache }) => {
            const match = cache.readFragment({
                id: input.id,
                fragment: gql`
                    fragment readPerformAction on Match {
                        actions {
                            randomSeed
                            type
                            payload
                            player {
                                id
                                name
                            }
                        }
                        states
                        stateIndex
                    }
                `,
            });

            const data = {
                __typename: 'Match',
                actions: [...match.actions.slice(0, match.stateIndex + 1), input.action],
                states: [...match.states.slice(0, match.stateIndex + 1), input.state],
                stateIndex: match.stateIndex + 1,
            };

            cache.writeFragment({
                id: input.id,
                fragment: gql`
                    fragment writePerformAction on Match {
                        actions {
                            randomSeed
                            type
                            payload
                            player {
                                id
                                name
                            }
                        }
                        states
                        stateIndex
                    }
                `,
                data,
            });

            return {
                id: input.id,
                ...data,
            };
        },
        goToAction: (parent, { input }, { cache }) => {
            const match = cache.readFragment({
                id: input.id,
                fragment: gql`
                    fragment readGoToAction on Match {
                        states
                        stateIndex
                        stateCountSinceLastLoad
                    }
                `,
            });

            const data = {
                __typename: 'Match',
                stateIndex: Math.min(
                    match.states.length - 1,
                    Math.max(0, input.index),
                ),
                historyMode: input.historyMode || false,
            };

            cache.writeFragment({
                id: input.id,
                fragment: gql`
                    fragment writeGoToAction on Match {
                        stateIndex
                        historyMode
                    }
                `,
                data,
            });

            return {
                id: input.id,
                ...data,
            };
        },
    },
    Match: {
        states: (parent, params, { cache }) => {
            let match;

            try {
                match = cache.readFragment({
                    id: parent.id,
                    fragment: gql`
                        fragment readStates on Match {
                            handle
                            actions {
                                randomSeed
                                type
                                payload
                                player {
                                    id
                                    name
                                }
                            }
                            participants {
                                player {
                                    id
                                    name
                                }
                            }
                            options {
                                type
                                values
                            }
                            states
                        }
                    `,
                });

                if (match.states && match.states.length === parent.actions.length) {
                    return parent.states;
                }
            } catch (error) {
                // there is no cache item yet
            }

            const previousStates = match ? match.states : [];
            const actions = match ? parent.actions.slice(previousStates.length) : parent.actions;

            const states = generateStates({
                ...(match || parent),
                actions,
            }, previousStates);

            cache.writeFragment({
                id: parent.id,
                fragment: gql`
                    fragment writeStates on Match {
                        states
                        stateIndex
                        stateCountSinceLastLoad
                        globalParams
                        historyMode
                    }
                `,
                data: {
                    __typename: 'Match',
                    states: JSON.stringify(states),
                    stateIndex: states.length - 1,
                    stateCountSinceLastLoad: states.length,
                    globalParams: [],
                    historyMode: false,
                },
            });

            return states;
        },
    },
};
