const convict = require('convict');

const config = convict({
    port: {
        express: {
            format: 'nat',
            default: 5051,
            env: 'PORT_EXPRESS',
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
            default: 'postgresql://localhost:5432/cbf',
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
    },
});

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
