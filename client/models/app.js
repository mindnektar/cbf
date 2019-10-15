import BaseModel from 'react-apollo-models';

export const FIELDS_PARTICIPANT = `
    player {
        id
        name
    }
    confirmed
    scores
    awaitsAction
    lastReadMessage {
        id
    }
    updatedAt
`;

const FIELDS_MATCH = `
    id
    handle
    status
    createdAt
    creator {
        id
    }
    participants {
        ${FIELDS_PARTICIPANT}
    }
    options {
        type
        values
    }
`;

export default class AppModel extends BaseModel {
    static query = {
        query: `
            query plays($matchFilter: MatchFilter) {
                me {
                    id
                    name
                    matches {
                        ${FIELDS_MATCH}
                    }
                }
                matches(filter: $matchFilter) {
                    ${FIELDS_MATCH}
                }
            }
        `,
        variables: () => ({
            matchFilter: {
                status: 'OPEN',
            },
        }),
        events: [{
            on: 'declineInvitation',
            cacheUpdatePath: ({ item }) => ({
                me: {
                    matches: {
                        $removeById: item.id,
                    },
                },
            }),
        }, {
            on: 'createMatch',
            cacheUpdatePath: ({ item }) => ({
                me: {
                    matches: {
                        $push: [item],
                    },
                },
            }),
        }],
        subscriptions: [{
            subscription: `
                subscription matchOpened {
                    matchOpened {
                        ${FIELDS_MATCH}
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
                            ${FIELDS_PARTICIPANT}
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
                            ${FIELDS_PARTICIPANT}
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
                            ${FIELDS_PARTICIPANT}
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
                            ${FIELDS_PARTICIPANT}
                        }
                    }
                }
            `,
            cacheUpdatePath: ({ item, cacheData }) => {
                if (!cacheData.matches.some(({ id }) => id === item.id)) {
                    return {};
                }

                let path = {
                    matches: {
                        [cacheData.matches.findIndex(({ id }) => id === item.id)]: {
                            participants: {
                                $set: item.participants,
                            },
                        },
                    },
                };

                if (!item.participants.some(({ player }) => player.id === cacheData.me.id)) {
                    path = {
                        ...path,
                        me: {
                            matches: {
                                $removeById: item.id,
                            },
                        },
                    };
                }

                return path;
            },
        }, {
            subscription: `
                subscription matchStarted {
                    matchStarted {
                        ${FIELDS_MATCH}
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
                            ${FIELDS_PARTICIPANT}
                        }
                        states @client
                        stateIndex @client
                        stateCountSinceLastLoad @client
                    }
                }
            `,
            cacheUpdatePath: ({ item, cacheData }) => {
                const participatesInMatch = item.participants.some(({ player }) => (
                    player.id === cacheData.me.id
                ));
                const matchPath = participatesInMatch ? {
                    [cacheData.matches.findIndex(({ id }) => id === item.id)]: {
                        status: {
                            $set: item.status,
                        },
                        actions: {
                            $set: item.actions,
                        },
                    },
                } : {
                    $removeById: item.id,
                };

                return {
                    matches: matchPath,
                };
            },
        }, {
            subscription: `
                subscription actionsPushed {
                    actionsPushed {
                        id
                        handle
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
                            ${FIELDS_PARTICIPANT}
                        }
                        states @client
                    }
                }
            `,
            cacheUpdatePath: ({ item, cacheData }) => ({
                me: {
                    matches: {
                        [cacheData.me.matches.findIndex(({ id }) => id === item.id)]: {
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
            cacheUpdatePath: ({ item, cacheData }) => ({
                me: {
                    matches: {
                        [cacheData.me.matches.findIndex(({ id }) => id === item.id)]: {
                            messages: {
                                $set: item.messages,
                            },
                        },
                    },
                },
            }),
        }],
    }
}
