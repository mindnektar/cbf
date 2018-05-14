const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const apiAuth = require('./api/auth');
const apiGames = require('./api/games');
const apiUsers = require('./api/users');

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

app.get('/script/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../public', request.url));
});

app.get('/style/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../public', request.url));
});

app.get('/img/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../../public', request.url));
});

apiAuth(app);
apiGames(app);
apiUsers(app);

app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../..', 'public', 'index.html'));
});

app.listen(3030, () => {
    console.log('Server running at http://localhost:3030');
});
