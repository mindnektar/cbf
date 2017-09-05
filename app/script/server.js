const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../..', 'public')));

app.get('/script/:path', (request, response) => {
    response.sendFile('script/' + request.params.path);
});

app.get('/style/:path', (request, response) => {
    response.sendFile('style/' + request.params.path);
});

app.get('/*', (request, response) => {
    response.sendFile('index.html');
});

app.listen(3030, () => {
    console.log('Server running at http://localhost:3030');
});
