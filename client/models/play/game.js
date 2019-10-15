import moment from 'moment';
import BaseModel from 'react-apollo-models';
import { FIELDS_PARTICIPANT } from '../app';

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
                            ${FIELDS_PARTICIPANT}
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
                        ${FIELDS_PARTICIPANT}
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
    }

    static mutations = [{
        mutation: `
            mutation openMatch($input: OpenMatchInput!) {
                openMatch(input: $input) {
                    id
                    status
                    participants {
                        ${FIELDS_PARTICIPANT}
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
                awaitsAction: false,
                lastReadMessage: null,
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
                        ${FIELDS_PARTICIPANT}
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
                    finishedAt
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
                    participants {
                        ${FIELDS_PARTICIPANT}
                    }
                }
            }
        `,
        optimisticResponse: ({ props, mutationVariables }) => ({
            __typename: 'Match',
            messages: [
                {
                    __typename: 'MatchMessage',
                    id: mutationVariables.messageId,
                    text: mutationVariables.text,
                    createdAt: moment().toISOString(),
                    author: props.data.me,
                },
                ...props.data.match.messages,
            ],
            participants: props.data.match.participants.map((participant) => ({
                __typename: 'MatchParticipant',
                ...participant,
                lastReadMessage: participant.player.id === props.data.me.id
                    ? {
                        __typename: 'MatchMessage',
                        id: mutationVariables.messageId,
                    }
                    : participant.lastReadMessage,
            })),
        }),
    }, {
        mutation: `
            mutation markMessagesRead($id: ID!) {
                markMessagesRead(id: $id) {
                    id
                    participants {
                        ${FIELDS_PARTICIPANT}
                    }
                }
            }
        `,
        optimisticResponse: ({ props }) => ({
            __typename: 'Match',
            participants: props.data.match.participants.map((participant) => ({
                __typename: 'MatchParticipant',
                ...participant,
                lastReadMessage: participant.player.id === props.data.me.id
                    ? {
                        __typename: 'MatchMessage',
                        id: props.data.match.messages[0] ? props.data.match.messages[0].id : null,
                    }
                    : participant.lastReadMessage,
            })),
        }),
    }]
}
