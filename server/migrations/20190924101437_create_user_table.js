exports.up = async (knex) => {
    await knex.schema.createTable('user', (t) => {
        t.uuid('id').primary();
        t.string('email').notNullable().unique();
        t.string('name').notNullable().unique();
        t.string('password_hash').notNullable();
        t.string('role').notNullable().defaultTo('user');
        t.timestamps(true, true);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTable('user');
};
