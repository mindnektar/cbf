exports.up = async (knex) => {
    await knex.schema.table('user', (t) => {
        t.string('invite_code');
        t.string('password_hash').nullable().alter();
        t.string('email').nullable().alter();
    });
};

exports.down = async (knex) => {
    await knex.schema.table('user', (t) => {
        t.dropColumn('invite_code');
        t.string('password_hash').notNullable().alter();
        t.string('email').notNullable().alter();
    });
};
