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
                    states @client
                    stateIndex @client
                    stateCountSinceLastLoad @client
                    globalParams @client
                }
            }
        `,
        variables: (props) => ({
            id: props.match.params.gameId,
        }),
    }

    static mutations = [{
        mutation: `
            mutation openMatch($id: ID!) {
                openMatch(id: $id) {
                    id
                    status
                }
            }
        `,
        optimisticResponse: () => ({
            status: 'OPEN',
        }),
    }, {
        mutation: `
            mutation startMatch($id: ID!) {
                startMatch(id: $id) {
                    id
                    status
                }
            }
        `,
        optimisticResponse: () => ({
            status: 'ACTIVE',
        }),
    }, {
        mutation: `
            mutation pushActions($input: PushActionsInput!) {
                pushActions(input: $input) {
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
    }]
}
