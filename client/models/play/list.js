import BaseModel from 'react-apollo-models';

export default class PlayModel extends BaseModel {
    static query = {
        query: `
            query plays($matchFilter: MatchFilter) {
                me {
                    id
                    name
                    matches {
                        id
                        handle
                        status
                        players {
                            id
                            name
                        }
                        scores {
                            values
                            player {
                                id
                                name
                            }
                        }
                    }
                }
                matches(filter: $matchFilter) {
                    id
                    handle
                    status
                    players {
                        id
                        name
                    }
                    options {
                        type
                        values
                    }
                }
            }
        `,
        variables: () => ({
            matchFilter: {
                status: 'OPEN',
            },
        }),
        subscriptions: [{
            subscription: `
                subscription matchOpened {
                    matchOpened {
                        id
                        handle
                        status
                        players {
                            id
                            name
                        }
                        options {
                            type
                            values
                        }
                    }
                }
            `,
            cacheUpdatePath: ({ item, cacheData }) => {
                if (cacheData.matches.some(({ id }) => id === item.id)) {
                    return {};
                }

                return {
                    matches: {
                        $push: [item],
                    },
                };
            },
        }],
    }

    static mutations = [{
        mutation: `
            mutation joinMatch($id: ID!) {
                joinMatch(id: $id) {
                    id
                    players {
                        id
                        name
                    }
                }
            }
        `,
        optimisticResponse: ({ props, mutationVariables }) => ({
            __typename: 'Match',
            players: [
                ...props.data.matches.find(({ id }) => id === mutationVariables.id).players,
                props.data.me,
            ],
        }),
    }, {
        mutation: `
            mutation createMatch($input: CreateMatchInput!) {
                createMatch(input: $input) {
                    id
                    handle
                    status
                    players {
                        id
                        name
                    }
                }
            }
        `,
        optimisticResponse: ({ props }) => ({
            __typename: 'Match',
            id: null,
            status: 'SETTING_UP',
            players: [props.data.me],
        }),
        cacheUpdatePath: ({ item }) => ({
            me: {
                matches: {
                    $push: [item],
                },
            },
        }),
    }]
}
