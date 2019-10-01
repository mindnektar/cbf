import BaseModel from './_base';

class MatchMessage extends BaseModel {
    static get tableName() {
        return 'match_message';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string' },
                text: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }

    static get relationMappings() {
        return {
            match: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'Match',
                join: {
                    from: 'match_message.match_id',
                    to: 'match.id',
                },
            },
            author: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'match_message.user_id',
                    to: 'user.id',
                },
            },
        };
    }
}

export default MatchMessage;
