const uuid = require('uuid/v4');

const GAME_STATUS_SETTING_UP = 0;

module.exports = (app) => {
    app.get('/api/games', (request, response) => {
        app.knex('game').select().then((result) => {
            const games = {};

            result.forEach((row) => {
                games[row.id] = row;
            });

            response.json(games);
        });
    });

    app.post('/api/games', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then(([user]) => {
                const id = uuid();
                const game = {
                    id,
                    status: GAME_STATUS_SETTING_UP,
                    title: request.body.game,
                };

                app.knex('game').insert(game).then(() => {
                    app.knex('user_in_game').insert({
                        user_id: user.id,
                        game_id: id,
                        admin: true,
                    }).then(() => {
                        response.json(game);
                    });
                });
            });
    });
};
