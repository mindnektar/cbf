import { RedisPubSub } from 'graphql-redis-subscriptions';
import redis from './redis';

export default new RedisPubSub({
    publisher: redis(),
    subscriber: redis(),
});
