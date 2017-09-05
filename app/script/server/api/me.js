module.exports = (app) => {
    app.get('/api/me', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then((result) => {
                if (result.length === 0) {
                    response.status(204).send();
                    return;
                }

                response.json({
                    email: result[0].email,
                    username: result[0].username,
                });
            });
    });
};
