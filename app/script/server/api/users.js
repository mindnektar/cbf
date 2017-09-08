module.exports = (app) => {
    app.get('/api/users', (request, response) => {
        app.knex('user')
            .select()
            .then((result) => {
                const users = {};

                result.forEach((row) => {
                    users[row.id] = {
                        gender: row.gender,
                        id: row.id,
                        username: row.username,
                    };
                });

                response.json(users);
            });
    });

    app.get('/api/me', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then(([user]) => {
                if (!user) {
                    response.status(204).send();
                    return;
                }

                app.knex('user_in_game').where('user_id', user.id).select().then((games) => {
                    const myGames = {};

                    games.forEach((game) => {
                        myGames[game.game_id] = {
                            admin: game.admin,
                            id: game.game_id,
                        };
                    });

                    response.json({
                        gender: user.gender,
                        email: user.email,
                        games: myGames,
                        id: user.id,
                        username: user.username,
                    });
                });
            });
    });
};
