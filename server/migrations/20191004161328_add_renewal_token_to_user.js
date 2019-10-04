exports.up = async (knex) => {
    await knex.schema.table('user', (t) => {
        t.string('renewal_token');
    });
};

exports.down = async (knex) => {
    await knex.schema.table('user', (t) => {
        t.dropColumn('renewal_token');
    });
};
