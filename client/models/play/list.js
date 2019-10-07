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
                        participants {
                            player {
                                id
                                name
                            }
                            confirmed
                            scores
                        }
                    }
                }
                matches(filter: $matchFilter) {
                    id
                    handle
                    status
                    participants {
                        player {
                            id
                            name
                        }
                        confirmed
                        scores
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
                        participants {
                            player {
                                id
                                name
                            }
                            confirmed
                            scores
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
        }, {
            subscription: `
                subscription playerJoined {
                    playerJoined {
                        id
                        participants {
                            player {
                                id
                                name
                            }
                            confirmed
                            scores
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
                        [cacheData.matches.findIndex(({ id }) => id === item.id)]: {
                            participants: {
                                $set: item.participants,
                            },
                        },
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
                    participants {
                        player {
                            id
                            name
                        }
                        confirmed
                        scores
                    }
                }
            }
        `,
        optimisticResponse: ({ props, mutationVariables }) => ({
            __typename: 'Match',
            participants: [
                ...props.data.matches.find(({ id }) => id === mutationVariables.id).participants,
                { player: props.data.me, confirmed: true, scores: null },
            ],
        }),
    }, {
        mutation: `
            mutation createMatch($input: CreateMatchInput!) {
                createMatch(input: $input) {
                    id
                    handle
                    status
                    participants {
                        player {
                            id
                            name
                        }
                        confirmed
                        scores
                    }
                }
            }
        `,
        optimisticResponse: ({ props }) => ({
            __typename: 'Match',
            id: null,
            status: 'SETTING_UP',
            participants: [{ player: props.data.me, confirmed: true, scores: null }],
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
