import BaseModel from './_base';

class MatchScore extends BaseModel {
    static get tableName() {
        return 'match_score';
    }

    static get idColumn() {
        return ['match_id', 'user_id'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
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
                    from: 'match_score.match_id',
                    to: 'match.id',
                },
            },
            player: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'match_score.user_id',
                    to: 'user.id',
                },
            },
        };
    }
}

export default MatchScore;
