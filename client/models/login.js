import { AUTH_TYPE_NONE } from 'auth';
import BaseModel from 'react-apollo-models';

export default class LoginModel extends BaseModel {
    static query = {
        query: `
            query {
                me {
                    id
                    name
                }
            }
        `,
    }

    static mutations = [{
        mutation: `
            mutation login($input: LoginInput!) {
                login(input: $input) {
                    authToken
                }
            }
        `,
        optimisticResponse: null,
        context: { authType: AUTH_TYPE_NONE },
    }]
}
