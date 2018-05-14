import { Router } from 'express';
import _ from 'lodash';
import authenticate from '../middleware/authenticate';
import { User } from '../models/user';

const router = new Router();

router.get('/users', (request, response) => {
    User.find()
        .then(users => response.send(users))
        .catch(error => response.status(400).send(error));
});

router.post('/users', (request, response) => {
    const body = _.pick(request.body, ['username', 'email', 'password']);
    const user = new User(body);

    user.save()
        .then(() => user.generateAuthToken())
        .then(token => response.header('x-auth', token).send(user))
        .catch(error => response.status(400).send(error));
});

router.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

router.post('/users/login', (request, response) => {
    const body = _.pick(request.body, ['username', 'password']);

    User.findByCredentials(body.username, body.password)
        .then(user => (
            user.generateAuthToken().then(token => (
                response.header('x-auth', token).send(user)
            ))
        ))
        .catch(error => response.status(400).send(error));
});

router.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token)
        .then(() => response.sendStatus(204))
        .catch(error => response.status(400).send(error));
});

export default router;
