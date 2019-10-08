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
                        createdAt
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
                match(id: $id) {
                    id
                    handle
                    status
                    createdAt
                    creator {
                        id
                    }
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
                users {
                    id
                    name
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
            cacheUpdatePath: ({ item }) => ({
                match: {
                    participants: {
                        $set: item.participants,
                    },
                },
            }),
        }, {
            subscription: `
                subscription invitationConfirmed {
                    invitationConfirmed {
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
            cacheUpdatePath: ({ item }) => ({
                match: {
                    participants: {
                        $set: item.participants,
                    },
                },
            }),
        }, {
            subscription: `
                subscription invitationDeclined {
                    invitationDeclined {
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
            cacheUpdatePath: ({ item }) => ({
                match: {
                    participants: {
                        $set: item.participants,
                    },
                },
            }),
        }, {
            subscription: `
                subscription removedPlayerFromMatch {
                    removedPlayerFromMatch {
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
            cacheUpdatePath: ({ item }) => ({
                match: {
                    participants: {
                        $set: item.participants,
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
                        participants {
                            player {
                                id
                                name
                            }
                            confirmed
                            scores
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
                    participants: {
                        $set: item.participants,
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
        optimisticResponse: ({ mutationVariables }) => ({
            __typename: 'Match',
            status: 'OPEN',
            participants: mutationVariables.players.map((id) => ({
                __typename: 'MatchParticipant',
                player: {
                    __typename: 'User',
                    id,
                    name: null,
                },
                confirmed: false,
                scores: null,
            })),
            options: mutationVariables.options.map((option) => ({
                __typename: 'MatchOption',
                ...option,
            })),
        }),
    }, {
        mutation: `
            mutation removePlayerFromMatch($input: RemovePlayerFromMatchInput!) {
                removePlayerFromMatch(input: $input) {
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
            participants: props.data.match.participants
                .map((participant) => ({
                    __typename: 'MatchParticipant',
                    ...participant,
                }))
                .filter(({ player }) => player.id !== mutationVariables.id),
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
                    participants {
                        player {
                            id
                            name
                        }
                        confirmed
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
