const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const apiAuth = require('./server/api/auth');
const apiGames = require('./server/api/games');
const apiMe = require('./server/api/me');
const app = express();

app.knex = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'cbf',
    },
});

app.use(bodyParser.json());

app.get('/script/:path', (request, response) => {
    response.sendFile(path.join(__dirname, '../..', 'public', 'script/', request.params.path));
});

app.get('/style/:path', (request, response) => {
    response.sendFile(path.join(__dirname, '../..', 'public', 'style/', request.params.path));
});

apiAuth(app);
apiGames(app);
apiMe(app);

app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../..', 'public', 'index.html'));
});

app.listen(3030, () => {
    console.log('Server running at http://localhost:3030');
});
