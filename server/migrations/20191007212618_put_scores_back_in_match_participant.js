exports.up = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.json('scores').nullable();
    });
    await knex.schema.dropTable('match_score');
};

exports.down = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.dropColumn('scores');
    });
    await knex.schema.createTable('match_score', (t) => {
        t.uuid('match_id').notNullable();
        t.foreign('match_id').references('match.id').onDelete('CASCADE');
        t.uuid('user_id').notNullable();
        t.foreign('user_id').references('user.id').onDelete('CASCADE');
        t.json('values').notNullable();
        t.primary(['match_id', 'user_id']);
        t.timestamps(true, true);
    });
};
