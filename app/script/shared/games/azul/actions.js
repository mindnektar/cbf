const actions = {
    END_TURN: require('./actions/END_TURN'),
};

module.exports = {
    ...actions,
    findById: id => Object.values(actions).find(action => action.id === id),
};
