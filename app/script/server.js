const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const apiAuth = require('./server/api/auth');
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

app.use('/*', express.static(path.join(__dirname, '../..', 'public')));
app.use(bodyParser.json());

app.get('/script/:path', (request, response) => {
    response.sendFile('script/' + request.params.path);
});

app.get('/style/:path', (request, response) => {
    response.sendFile('style/' + request.params.path);
});

apiAuth(app);

app.get('/*', (request, response) => {
    response.sendFile('index.html');
});

app.listen(3030, () => {
    console.log('Server running at http://localhost:3030');
});
