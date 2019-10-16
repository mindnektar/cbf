import BaseModel from './_base';

class Match extends BaseModel {
    static get tableName() {
        return 'match';
    }

    static get STATUS() {
        return {
            SETTING_UP: 'SETTING_UP',
            OPEN: 'OPEN',
            ACTIVE: 'ACTIVE',
            FINISHED: 'FINISHED',
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string' },
                handle: { type: 'string' },
                status: {
                    type: 'enum',
                    default: Match.STATUS.SETTING_UP,
                    enum: Object.values(Match.STATUS),
                },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                finishedAt: { type: ['string', 'null'] },
            },
        };
    }

    static get relationMappings() {
        return {
            creator: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'match.creator_user_id',
                    to: 'user.id',
                },
            },
            participants: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'MatchParticipant',
                modify: (builder) => builder.orderBy('user_id'),
                join: {
                    from: 'match.id',
                    to: 'match_participant.match_id',
                },
            },
            actions: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'Action',
                modify: (builder) => builder.orderBy('index'),
                join: {
                    from: 'match.id',
                    to: 'action.match_id',
                },
            },
            messages: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'MatchMessage',
                modify: (builder) => builder.orderBy('created_at', 'desc'),
                join: {
                    from: 'match.id',
                    to: 'match_message.match_id',
                },
            },
            options: {
                relation: BaseModel.HasManyRelation,
                modelClass: 'MatchOption',
                join: {
                    from: 'match.id',
                    to: 'match_option.match_id',
                },
            },
        };
    }

    static get filters() {
        return {
            status: (builder, value) => (
                builder.where('status', value)
            ),
        };
    }
}

export default Match;
