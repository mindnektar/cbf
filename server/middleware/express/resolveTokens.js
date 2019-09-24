const asyncHandler = require('express-async-handler');

class Authorization {
    constructor(data = {}) {
        this.id = data.id || null;
        this.role = data.role || 'anonymous';
    }
}

class AnonymousAuthorization extends Authorization {}

class UserAuthorization extends Authorization {}

const resolve = async (data) => {
    if (!data) {
        return new AnonymousAuthorization(data);
    }

    if (data.role === 'user') {
        return new UserAuthorization(data);
    }

    return new AnonymousAuthorization(data);
};

module.exports = asyncHandler(async (request, response, next) => {
    request.auth = await resolve(request.user);

    next();
});

module.exports.resolve = resolve;
