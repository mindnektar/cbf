const states = {
    BID_FOR_TURN_ORDER: require('./states/BID_FOR_TURN_ORDER'),
    COLLECT_DJINN: require('./states/COLLECT_DJINN'),
    COLLECT_GOLD_COINS: require('./states/COLLECT_GOLD_COINS'),
    COLLECT_MARKET_RESOURCES: require('./states/COLLECT_MARKET_RESOURCES'),
    END_TURN: require('./states/END_TURN'),
    EXECUTE_MEEPLE_ACTION: require('./states/EXECUTE_MEEPLE_ACTION'),
    GO_TO_BIG_MARKET: require('./states/GO_TO_BIG_MARKET'),
    GO_TO_SMALL_MARKET: require('./states/GO_TO_SMALL_MARKET'),
    MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK: require('./states/MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK'),
    PLACE_PALACE: require('./states/PLACE_PALACE'),
    PLACE_PALM_TREE: require('./states/PLACE_PALM_TREE'),
    SELECT_FAKIRS_FOR_MEEPLE_ACTION: require('./states/SELECT_FAKIRS_FOR_MEEPLE_ACTION'),
    SELECT_MEEPLE_TO_KILL: require('./states/SELECT_MEEPLE_TO_KILL'),
    SELECT_MEEPLE_TO_PLACE: require('./states/SELECT_MEEPLE_TO_PLACE'),
    SELECT_TILE_FOR_MOVEMENT: require('./states/SELECT_TILE_FOR_MOVEMENT'),
    SELECT_TILE_FOR_PLACEMENT: require('./states/SELECT_TILE_FOR_PLACEMENT'),
    TAKE_CONTROL_OF_TILE: require('./states/TAKE_CONTROL_OF_TILE'),
    TAKE_CONTROL_OF_TILE_AFTER_ASSASSINATION: require('./states/TAKE_CONTROL_OF_TILE_AFTER_ASSASSINATION'),
};

module.exports = {
    ...states,
    findById: id => Object.values(states).find(state => state.id === id),
};
