exports.up = async (knex) => {
    await knex.schema.createTable('match_participant', (t) => {
        t.uuid('match_id').notNullable();
        t.foreign('match_id').references('match.id').onDelete('CASCADE');
        t.uuid('user_id').notNullable();
        t.foreign('user_id').references('user.id').onDelete('CASCADE');
        t.primary(['match_id', 'user_id']);
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('match_participant');
};
