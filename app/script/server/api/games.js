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
};
