import { User } from '../models/user';

export default (request, response, next) => {
    const token = request.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        request.user = user;
        request.token = token;

        next();

        return Promise.resolve();
    }).catch(() => {
        response.status(401).send({ errors: 'unauthorized' });
    });
};
