const uuid = require('uuid/v4');
const gameConstants = require('../../shared/constants/games');

module.exports = (app) => {
    app.get('/api/games', (request, response) => {
        app.knex('game')
            .innerJoin('user_in_game', 'game.id', 'user_in_game.game_id')
            .groupBy('game.id')
            .select('game.*', app.knex.raw('group_concat(user_in_game.user_id) as players'))
            .then((result) => {
                const games = {};

                result.forEach((row) => {
                    games[row.id] = {
                        created_at: row.created_at,
                        handle: row.handle,
                        id: row.id,
                        players: row.players.split(','),
                        status: row.status,
                    };
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
                    status: gameConstants.GAME_STATUS_SETTING_UP,
                    handle: request.body.game,
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

    app.patch('/api/games', (request, response) => {
        app.knex('game').where('id', request.body.id).update(request.body.data).then(() => {
            response.status(204).send();
        });
    });

    app.post('/api/user_in_game', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then(([user]) => {
                app.knex('user_in_game').insert({
                    game_id: request.body.id,
                    user_id: user.id,
                }).then(() => response.status(204).send());
            });
    });
};
