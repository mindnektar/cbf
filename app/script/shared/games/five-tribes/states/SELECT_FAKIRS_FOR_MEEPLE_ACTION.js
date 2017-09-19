module.exports = {
    id: 14,
    instruction: 'You may select fakirs from your hand to improve your action.',
    performOnConfirm: () => require('../actions').SELECT_FAKIRS_FOR_MEEPLE_ACTION,
};
