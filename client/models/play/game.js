import moment from 'moment';
import BaseModel from 'react-apollo-models';

export default class GameModel extends BaseModel {
    static query = {
        query: `
            query game($id: ID!) {
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
                    }
                }
                match(id: $id) {
                    id
                    handle
                    status
                    creator {
                        id
                    }
                    players {
                        id
                        name
                        score
                    }
                    options {
                        type
                        values
                    }
                    actions {
                        randomSeed
                        type
                        payload
                        player {
                            id
                            name
                        }
                    }
                    messages {
                        id
                        text
                        createdAt
                        author {
                            id
                            name
                        }
                    }
                    states @client
                    stateIndex @client
                    stateCountSinceLastLoad @client
                    globalParams @client
                    historyMode @client
                }
            }
        `,
        variables: (props) => ({
            id: props.match.params.gameId,
        }),
        subscriptions: [{
            subscription: `
                subscription playerJoined {
                    playerJoined {
                        id
                        players {
                            id
                            name
                            score
                        }
                    }
                }
            `,
            cacheUpdatePath: ({ item }) => ({
                match: {
                    players: {
                        $set: item.players,
                    },
                },
            }),
        }, {
            subscription: `
                subscription matchStarted {
                    matchStarted {
                        id
                        status
                        actions {
                            randomSeed
                            type
                            payload
                            player {
                                id
                                name
                            }
                        }
                        states @client
                        stateIndex @client
                        stateCountSinceLastLoad @client
                    }
                }
            `,
            cacheUpdatePath: ({ item }) => ({
                match: {
                    status: {
                        $set: item.status,
                    },
                    actions: {
                        $set: item.actions,
                    },
                },
            }),
        }, {
            subscription: `
                subscription actionsPushed {
                    actionsPushed {
                        id
                        status
                        actions {
                            randomSeed
                            type
                            payload
                            player {
                                id
                                name
                            }
                        }
                        players {
                            id
                            name
                            score
                        }
                        states @client
                    }
                }
            `,
            cacheUpdatePath: ({ item }) => ({
                match: {
                    status: {
                        $set: item.status,
                    },
                    actions: {
                        $set: item.actions,
                    },
                    players: {
                        $set: item.players,
                    },
                },
            }),
        }, {
            subscription: `
                subscription messageCreated {
                    messageCreated {
                        id
                        messages {
                            id
                            text
                            createdAt
                            author {
                                id
                                name
                            }
                        }
                    }
                }
            `,
            cacheUpdatePath: ({ item }) => ({
                match: {
                    messages: {
                        $set: item.messages,
                    },
                },
            }),
        }],
    }

    static mutations = [{
        mutation: `
            mutation openMatch($input: OpenMatchInput!) {
                openMatch(input: $input) {
                    id
                    status
                    options {
                        type
                        values
                    }
                }
            }
        `,
        optimisticResponse: ({ mutationVariables }) => ({
            __typename: 'Match',
            status: 'OPEN',
            options: mutationVariables.options.map((option) => ({
                ...option,
                __typename: 'MatchOption',
            })),
        }),
    }, {
        mutation: `
            mutation startMatch($id: ID!) {
                startMatch(id: $id) {
                    id
                    status
                    actions {
                        randomSeed
                        type
                        payload
                        player {
                            id
                            name
                        }
                    }
                    states @client
                }
            }
        `,
        optimisticResponse: null,
    }, {
        mutation: `
            mutation pushActions($input: PushActionsInput!) {
                pushActions(input: $input) {
                    id
                    status
                    actions {
                        randomSeed
                        type
                        payload
                        player {
                            id
                            name
                        }
                    }
                    players {
                        id
                        name
                        scores
                    }
                    states @client
                    stateIndex @client
                    stateCountSinceLastLoad @client
                    globalParams @client
                }
            }
        `,
        optimisticResponse: null,
    }, {
        mutation: `
            mutation performAction($input: PerformActionInput!) {
                performAction(input: $input) @client {
                    id
                    actions {
                        randomSeed
                        type
                        payload
                        player {
                            id
                            name
                        }
                    }
                    states @client
                    stateIndex @client
                    stateCountSinceLastLoad @client
                    globalParams @client
                }
            }
        `,
        optimisticResponse: null,
    }, {
        mutation: `
            mutation goToAction($input: GoToActionInput!) {
                goToAction(input: $input) @client {
                    id
                    stateIndex @client
                    historyMode @client
                }
            }
        `,
        optimisticResponse: null,
    }, {
        mutation: `
            mutation createMessage($input: CreateMessageInput!) {
                createMessage(input: $input) {
                    id
                    messages {
                        id
                        text
                        createdAt
                        author {
                            id
                            name
                        }
                    }
                }
            }
        `,
        optimisticResponse: ({ props, mutationVariables }) => ({
            __typename: 'Match',
            messages: [
                {
                    __typename: 'MatchMessage',
                    id: null,
                    text: mutationVariables.text,
                    createdAt: moment().toISOString(),
                    author: props.data.me,
                },
                ...props.data.match.messages,
            ],
        }),
    }]
}
