const states = {
    END_GAME: require('./states/END_GAME'),
    END_TURN: require('./states/END_TURN'),
    PICK_UP_TILES: require('./states/PICK_UP_TILES'),
    SCORE_BONUSES: require('./states/SCORE_BONUSES'),
    SCORE_FINISHED_LINES: require('./states/SCORE_FINISHED_LINES'),
    SELECT_PATTERN_LINE: require('./states/SELECT_PATTERN_LINE'),
};

module.exports = {
    ...states,
    findById: id => Object.values(states).find(state => state.id === id),
};
