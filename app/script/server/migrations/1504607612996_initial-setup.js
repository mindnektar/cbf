module.exports = {
    up: knex => Promise.all([
        knex.schema.createTable('user', (table) => {
            table.string('id').notNullable();
            table.string('username').notNullable();
            table.string('email').notNullable();
            table.string('password').notNullable();
            table.string('access-token');
            table.timestamps();
            table.unique('id');
        }),
        knex.schema.createTable('game', (table) => {
            table.string('id').notNullable();
            table.integer('status').unsigned().notNullable().defaultTo(0);
            table.timestamps();
            table.unique('id');
        }),
        knex.schema.createTable('game_state', (table) => {
            table.string('game_id').notNullable();
            table.integer('order').unsigned().notNullable();
            table.text('state').notNullable();
            table.timestamps();
            table.unique(['game_id', 'order']);
            table.foreign('game_id').references('game.id');
        }),
        knex.schema.createTable('user_in_game', (table) => {
            table.string('user_id').notNullable();
            table.string('game_id').notNullable();
            table.unique(['user_id', 'game_id']);
            table.foreign('user_id').references('user.id');
            table.foreign('game_id').references('game.id');
        }),
    ]),
    down: knex => Promise.all([
        knex.schema.dropTableIfExists('user_in_game'),
        knex.schema.dropTableIfExists('game_state'),
        knex.schema.dropTableIfExists('game'),
        knex.schema.dropTableIfExists('users'),
    ]),
};
