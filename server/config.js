import config from '../config';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env = {
    ...process.env,
    ...config[process.env.NODE_ENV],
};
