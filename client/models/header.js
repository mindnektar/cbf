import BaseModel from 'react-apollo-models';

export default class HeaderModel extends BaseModel {
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
}
