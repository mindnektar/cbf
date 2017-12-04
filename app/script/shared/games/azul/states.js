const states = {
    END_TURN: require('./states/END_TURN'),
    PICK_UP_TILES: require('./states/PICK_UP_TILES'),
};

module.exports = {
    ...states,
    findById: id => Object.values(states).find(state => state.id === id),
};
