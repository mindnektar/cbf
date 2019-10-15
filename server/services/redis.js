/* eslint camelcase: "off" */
import redis from 'redis';
import config from '../../shared/config';

const clients = [];

const factory = () => {
    const client = redis.createClient(config.redis.uri, {
        retry_strategy: ({ attempt, total_retry_time }) => {
            if (total_retry_time > config.redis.retry.maxTotalTime) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error('Retry time exhausted');
            }
            if (attempt > config.redis.retry.maxAttempts) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(attempt * 1000, config.redis.retry.maxReconnectDelay);
        },
    });
    client.on('error', console.error);
    client.on('connect', () => {
        console.log('redis connected.');
    });
    client.on('reconnecting', ({ delay, attempt }) => {
        console.log(`redis reconnect attempt #${attempt} with delay ${delay}ms.`);
    });
    client.on('end', () => {
        console.log('redis connection closed.');
    });
    clients.push(client);
    return client;
};

export default factory;
export const quitAll = () => {
    clients.forEach((client) => client.quit());
};
