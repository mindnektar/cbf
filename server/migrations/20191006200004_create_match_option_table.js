exports.up = async (knex) => {
    await knex.schema.createTable('match_option', (t) => {
        t.uuid('match_id').notNullable();
        t.foreign('match_id').references('match.id').onDelete('CASCADE');
        t.string('type').notNullable();
        t.primary(['match_id', 'type']);
        t.json('values').notNullable();
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('match_option');
};
