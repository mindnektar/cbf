exports.up = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.boolean('awaits_action').notNullable().defaultTo(false);
        t.uuid('last_read_message_id').nullable();
        t.foreign('last_read_message_id').references('match_message.id').onDelete('SET NULL');
    });
};

exports.down = async (knex) => {
    await knex.schema.table('match_participant', (t) => {
        t.dropColumn('awaits_action');
        t.dropColumn('last_read_message_id');
    });
};
