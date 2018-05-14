const actions = {
    END_TURN: require('./actions/END_TURN'),
    PICK_UP_TILES: require('./actions/PICK_UP_TILES'),
};

module.exports = {
    ...actions,
    findById: id => Object.values(actions).find(action => action.id === id),
};
