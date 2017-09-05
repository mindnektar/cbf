module.exports = (app) => {
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
                    response.json({
                        email: user.email,
                        games: games.map(game => game.game_id),
                        username: user.username,
                    });
                });
            });
    });
};
