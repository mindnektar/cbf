const actions = {
    END_GAME: require('./actions/END_GAME'),
    END_TURN: require('./actions/END_TURN'),
    PICK_UP_TILES: require('./actions/PICK_UP_TILES'),
    SCORE_BONUSES: require('./actions/SCORE_BONUSES'),
    SCORE_FINISHED_LINES: require('./actions/SCORE_FINISHED_LINES'),
    SELECT_PATTERN_LINE: require('./actions/SELECT_PATTERN_LINE'),
    SETUP: require('./actions/SETUP'),
};

module.exports = {
    ...actions,
    findById: (id) => Object.values(actions).find((action) => action.id === id),
};
