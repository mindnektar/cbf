import BaseModel from 'react-apollo-models';

export default class UsersModel extends BaseModel {
    static query = {
        query: `
            query {
                me {
                    id
                    name
                    isAdmin
                }
                users {
                    id
                    name
                    inviteCode
                    isAdmin
                    active
                }
            }
        `,
    }

    static mutations = [{
        mutation: `
            mutation createUser($input: CreateUserInput!) {
                createUser(input: $input) {
                    id
                    name
                    inviteCode
                    isAdmin
                    active
                }
            }
        `,
        optimisticResponse: () => ({
            __typename: 'User',
            id: null,
            inviteCode: '',
            isAdmin: false,
            active: false,
        }),
        cacheUpdatePath: ({ item }) => ({
            users: {
                $push: [item],
            },
        }),
    }]
}
