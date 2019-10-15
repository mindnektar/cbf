const convict = require('convict');

const config = convict({
    port: {
        express: {
            format: 'nat',
            default: 5051,
            env: 'PORT',
        },
        webpackDevServer: {
            format: 'nat',
            default: 5050,
            env: 'PORT_WEBPACK_DEV_SERVER',
        },
    },
    knex: {
        client: {
            format: ['pg'],
            default: 'pg',
        },
        connection: {
            format: String,
            default: 'postgresql://localhost:5433/cbf',
            env: 'POSTGRES_URI',
        },
        migrations: {
            tableName: {
                format: String,
                default: 'migrations',
            },
        },
        debug: {
            format: Boolean,
            default: false,
            env: 'DATABASE_DEBUG',
        },
    },
    redis: {
        uri: {
            format: String,
            default: 'redis://localhost:6380',
            env: 'REDIS_URI',
        },
        retry: {
            maxTotalTime: {
                format: 'nat',
                default: 1000 * 60 * 60,
            },
            maxAttempts: {
                format: 'nat',
                default: 12,
            },
            maxReconnectDelay: {
                format: 'nat',
                default: 1000 * 60,
            },
        },
    },
    bcrypt: {
        saltRounds: {
            format: 'nat',
            default: 12,
            env: 'BCRYPT_SALT_ROUNDS',
        },
    },
    jwt: {
        secret: {
            format: String,
            default: ',h!fk5BR8sABZAPN',
            sensitive: true,
            env: 'JWT_SECRET',
        },
    },
    tokens: {
        identity: {
            expiresIn: {
                format: String,
                default: '1d',
                env: 'IDENTITY_TOKEN_EXPIRES_IN',
            },
            algorithm: {
                format: ['HS256', 'HS384', 'HS512'],
                default: 'HS512',
                env: 'IDENTITY_TOKEN_ALGORITHM',
            },
        },
        renewal: {
            length: {
                format: 'nat',
                default: 32,
                env: 'RENEWAL_TOKEN_LENGTH',
            },
            expiresIn: {
                format: String,
                default: '60d',
                env: 'RENEWAL_TOKEN_EXPIRES_IN',
            },
            algorithm: {
                format: ['HS256', 'HS384', 'HS512'],
                default: 'HS512',
                env: 'RENEWAL_TOKEN_ALGORITHM',
            },
        },
    },
});

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
