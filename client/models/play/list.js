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
                    }
                }
                matches(filter: $matchFilter) {
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
                    }
                }
            `,
            cacheUpdatePath: ({ item, cacheData }) => {
                if (cacheData.matches.some(({ id }) => id === item.id)) {
                    return {};
                }

                let path = {
                    matches: {
                        $push: [item],
                    },
                };

                if (item.participants.some(({ player }) => player.id === cacheData.me.id)) {
                    path = {
                        ...path,
                        me: {
                            matches: {
                                $push: [item],
                            },
                        },
                    };
                }

                return path;
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
            cacheUpdatePath: ({ cacheData, item }) => ({
                matches: {
                    [cacheData.matches.findIndex(({ id }) => id === item.id)]: {
                        participants: {
                            $set: item.participants,
                        },
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
            cacheUpdatePath: ({ cacheData, item }) => ({
                matches: {
                    [cacheData.matches.findIndex(({ id }) => id === item.id)]: {
                        participants: {
                            $set: item.participants,
                        },
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
            mutation confirmInvitation($id: ID!) {
                confirmInvitation(id: $id) {
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
            participants: props.data.matches.find(({ id }) => id === mutationVariables.id)
                .participants
                .map((participant) => ({
                    __typename: 'MatchParticipant',
                    ...participant,
                    confirmed: participant.player.id === mutationVariables.id
                        ? true
                        : participant.confirmed,
                })),
        }),
    }, {
        mutation: `
            mutation declineInvitation($id: ID!) {
                declineInvitation(id: $id) {
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
            participants: props.data.matches.find(({ id }) => id === mutationVariables.id)
                .participants
                .map((participant) => ({
                    __typename: 'MatchParticipant',
                    ...participant,
                }))
                .filter(({ player }) => player.id !== mutationVariables),
        }),
        cacheUpdatePath: ({ item }) => ({
            me: {
                matches: {
                    $removeById: item.id,
                },
            },
        }),
    }, {
        mutation: `
            mutation createMatch($input: CreateMatchInput!) {
                createMatch(input: $input) {
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
