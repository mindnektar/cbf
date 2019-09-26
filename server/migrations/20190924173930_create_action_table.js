exports.up = async (knex) => {
    await knex.schema.createTable('action', (t) => {
        t.uuid('match_id').notNullable();
        t.foreign('match_id').references('match.id').onDelete('CASCADE');
        t.integer('index').notNullable();
        t.uuid('user_id');
        t.foreign('user_id').references('user.id').onDelete('CASCADE');
        t.string('random_seed');
        t.integer('type').notNullable();
        t.json('payload');
        t.primary(['match_id', 'index']);
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('action');
};
