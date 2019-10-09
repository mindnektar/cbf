exports.up = async (knex) => {
    await knex.schema.createTable('announcement', (t) => {
        t.uuid('id').primary();
        t.uuid('author_user_id').notNullable();
        t.foreign('author_user_id').references('user.id').onDelete('CASCADE');
        t.string('title').notNullable();
        t.text('text').notNullable();
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('announcement');
};
