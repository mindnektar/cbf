class CustomError extends Error {
    constructor(message) {
        super(message);
        this.isCustomError = true;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class AuthorizationError extends CustomError {}

class AuthorizationRequiredError extends AuthorizationError {}

class InvalidCredentialsError extends AuthorizationError {}

class InvalidRenewalTokenError extends AuthorizationError {}

class TokenExpiredError extends AuthorizationError {}

class IllegalArgumentError extends CustomError {}

class IllegalStateError extends CustomError {}

class ResourceNotFoundError extends CustomError {}

module.exports = {
    AuthorizationRequiredError,
    TokenExpiredError,
    IllegalArgumentError,
    IllegalStateError,
    InvalidCredentialsError,
    InvalidRenewalTokenError,
    ResourceNotFoundError,
};
