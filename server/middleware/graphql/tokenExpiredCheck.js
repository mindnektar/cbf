const { TokenExpiredError } = require('../../errors');

module.exports = (resolve, parent, variables, context, info) => {
    if (context.tokenExpired) {
        throw new TokenExpiredError('token expired, please renew');
    }
    return resolve(parent, variables, context, info);
};
