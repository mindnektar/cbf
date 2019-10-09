import BaseModel from 'react-apollo-models';
import { FIELDS_PARTICIPANT } from '../app';

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
                            ${FIELDS_PARTICIPANT}
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
                        ${FIELDS_PARTICIPANT}
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
    }

    static mutations = [{
        mutation: `
            mutation joinMatch($id: ID!) {
                joinMatch(id: $id) {
                    id
                    participants {
                        ${FIELDS_PARTICIPANT}
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
                        ${FIELDS_PARTICIPANT}
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
                        ${FIELDS_PARTICIPANT}
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
                .filter(({ player }) => player.id !== mutationVariables.id),
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
                        ${FIELDS_PARTICIPANT}
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
    }]
}
