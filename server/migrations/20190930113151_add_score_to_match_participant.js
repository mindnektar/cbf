exports.up = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.integer('score').nullable();
    });
};

exports.down = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.dropColumn('score');
    });
};
