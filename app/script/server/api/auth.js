const passwordHash = require('password-hash');
const uuid = require('uuid/v4');

module.exports = (app) => {
    app.post('/api/auth', (request, response) => {
        app.knex('user').where('username', request.body.username).select().then((result) => {
            if (result.length === 0) {
                response.json({ error: 'invalid_username' });
                return;
            }

            if (!passwordHash.verify(request.body.password, result[0].password)) {
                response.json({ error: 'invalid_password' });
                return;
            }

            const token = uuid();

            app.knex('user').where('id', result[0].id).update({ access_token: token }).then(() => {
                response.json({ token });
            });
        });
    });
};
