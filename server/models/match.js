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
            players: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'User',
                join: {
                    from: 'match.id',
                    through: {
                        from: 'match_participant.match_id',
                        to: 'match_participant.user_id',
                        extra: ['score'],
                    },
                    to: 'user.id',
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
