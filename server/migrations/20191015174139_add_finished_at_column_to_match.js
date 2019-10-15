exports.up = async (knex) => {
    await knex.schema.table('match', (t) => {
        t.timestamp('finished_at');
    });
};

exports.down = async (knex) => {
    await knex.schema.table('match', (t) => {
        t.dropColumn('finished_at');
    });
};
