import BaseModel from './_base';

class Action extends BaseModel {
    static get tableName() {
        return 'action';
    }

    static get idColumn() {
        return ['match_id', 'index'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                index: { type: 'integer' },
                randomSeed: { type: 'string' },
                type: { type: 'integer' },
                payload: { type: ['json', 'null'] },
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
                    from: 'action.match_id',
                    to: 'match.id',
                },
            },
            player: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'action.user_id',
                    to: 'user.id',
                },
            },
        };
    }
}

export default Action;
