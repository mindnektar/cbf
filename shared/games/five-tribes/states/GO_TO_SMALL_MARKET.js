module.exports = {
    id: 7,
    instruction: 'You may select one of the first 3 resources from the market for 3 gold coins.',
    performOnConfirm: () => require('../actions').GO_TO_SMALL_MARKET,
    params: [
        { name: 'selectedResources', defaultValue: [] },
    ],
};
