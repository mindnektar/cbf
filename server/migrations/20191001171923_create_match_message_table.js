exports.up = async (knex) => {
    await knex.schema.createTable('match_message', (t) => {
        t.uuid('id').primary();
        t.uuid('match_id').notNullable();
        t.foreign('match_id').references('match.id').onDelete('CASCADE');
        t.uuid('user_id').notNullable();
        t.foreign('user_id').references('user.id').onDelete('SET NULL');
        t.text('text');
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('match_message');
};
