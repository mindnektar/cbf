import BaseModel from './_base';

class Announcement extends BaseModel {
    static get tableName() {
        return 'announcement';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                text: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }

    static get relationMappings() {
        return {
            author: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'announcement.author_user_id',
                    to: 'user.id',
                },
            },
        };
    }
}

export default Announcement;
