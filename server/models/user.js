import util from 'util';
import jwt from 'jsonwebtoken';
import BaseModel from './_base';
import config from '../../config';

class User extends BaseModel {
    static get tableName() {
        return 'user';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                passwordHash: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }

    static get relationMappings() {
        return {
            matches: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'Match',
                join: {
                    from: 'user.id',
                    through: {
                        from: 'match_participant.user_id',
                        to: 'match_participant.match_id',
                    },
                    to: 'match.id',
                },
            },
        };
    }

    generateAuthToken() {
        return util.promisify(jwt.sign)(
            {
                id: this.id,
                role: this.role,
            },
            config.jwt.secret,
            config.tokens.identity,
        );
    }
}

export default User;
