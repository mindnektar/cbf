import BaseModel from './_base';

class MatchParticipant extends BaseModel {
    static get tableName() {
        return 'match_participant';
    }

    static get idColumn() {
        return ['match_id', 'user_id'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                confirmed: { type: 'boolean' },
                scores: { type: ['array', 'null'] },
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
                    from: 'match_participant.match_id',
                    to: 'match.id',
                },
            },
            player: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'match_participant.user_id',
                    to: 'user.id',
                },
            },
        };
    }
}

export default MatchParticipant;
