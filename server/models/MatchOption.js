import BaseModel from './_base';

class MatchOption extends BaseModel {
    static get tableName() {
        return 'match_option';
    }

    static get idColumn() {
        return ['match_id', 'type'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                type: { type: 'string' },
                values: { type: 'array' },
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
                    from: 'match_option.match_id',
                    to: 'match.id',
                },
            },
        };
    }
}

export default MatchOption;
