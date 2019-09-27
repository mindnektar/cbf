const { withFilter } = require('graphql-subscriptions');

module.exports = (channel, handler, filter) => ({
    [channel]: {
        resolve: handler,
        subscribe: withFilter(
            (parent, variables, { pubsub }) => (
                pubsub.asyncIterator(channel)
            ),
            filter || (() => true),
        ),
    },
});
