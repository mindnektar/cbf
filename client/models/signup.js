import { AUTH_TYPE_NONE } from 'auth';
import BaseModel from 'react-apollo-models';

export default class SignupModel extends BaseModel {
    static query = {
        query: `
            query {
                me {
                    id
                }
            }
        `,
    }

    static mutations = [{
        mutation: `
            mutation confirmUser($input: ConfirmUserInput!) {
                confirmUser(input: $input) {
                    authToken
                    renewalToken
                }
            }
        `,
        optimisticResponse: null,
        context: { authType: AUTH_TYPE_NONE },
    }]
}
