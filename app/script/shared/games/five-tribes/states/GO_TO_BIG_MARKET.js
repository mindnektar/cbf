module.exports = {
    id: 19,
    instruction: 'You may select two of the first 6 resources from the market for 6 gold coins.',
    performOnConfirm: () => require('../actions').GO_TO_BIG_MARKET,
};
