import express from 'express';
import bodyParser from 'body-parser';
import serializeError from 'serialize-error';
import path from 'path';
import './config';
import matchesApi from './api/matches';
import usersApi from './api/users';

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

if (process.env.NODE_ENV === 'development') {
    app.use((request, response, next) => {
        response.set({
            'Access-Control-Allow-Origin': `http://localhost:${process.env.PORTS.WEBPACK_DEV_SERVER}`,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'content-type, x-auth',
            'Access-Control-Expose-Headers': 'x-auth',
        });

        next();
    });
}

app.use('/api', matchesApi);
app.use('/api', usersApi);

app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((error, request, response, next) => {
    console.error(serializeError(error));
    response.sendStatus(400);
    next();
});

app.listen(process.env.PORTS.EXPRESS, () => {
    console.log(`Server running at http://localhost:${process.env.PORTS.EXPRESS}`);
});
