exports.up = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.boolean('confirmed').notNullable().defaultTo(false);
    });
};

exports.down = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.dropColumn('confirmed');
    });
};
