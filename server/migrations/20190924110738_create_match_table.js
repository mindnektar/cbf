exports.up = async (knex) => {
    await knex.schema.createTable('match', (t) => {
        t.uuid('id').primary();
        t.uuid('creator_user_id').notNullable();
        t.foreign('creator_user_id').references('user.id').onDelete('CASCADE');
        t.string('handle').notNullable();
        t.string('status').notNullable().defaultTo('SETTING_UP');
        t.json('initial_state');
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('match');
};
