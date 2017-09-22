const actions = {
    COLLECT_DJINN: require('./actions/COLLECT_DJINN'),
    COLLECT_GOLD_COINS: require('./actions/COLLECT_GOLD_COINS'),
    COLLECT_MARKET_RESOURCES: require('./actions/COLLECT_MARKET_RESOURCES'),
    END_TURN: require('./actions/END_TURN'),
    GO_TO_BIG_MARKET: require('./actions/GO_TO_BIG_MARKET'),
    GO_TO_SMALL_MARKET: require('./actions/GO_TO_SMALL_MARKET'),
    KILL_ELDER_FROM_PLAYER: require('./actions/KILL_ELDER_FROM_PLAYER'),
    KILL_MEEPLE_ON_BOARD: require('./actions/KILL_MEEPLE_ON_BOARD'),
    KILL_VIZIER_FROM_PLAYER: require('./actions/KILL_VIZIER_FROM_PLAYER'),
    MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK: require('./actions/MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK'),
    PICK_UP_MEEPLE: require('./actions/PICK_UP_MEEPLE'),
    PLACE_MEEPLE: require('./actions/PLACE_MEEPLE'),
    PLACE_PALACE: require('./actions/PLACE_PALACE'),
    PLACE_PALM_TREE: require('./actions/PLACE_PALM_TREE'),
    SELECT_FAKIRS_FOR_MEEPLE_ACTION: require('./actions/SELECT_FAKIRS_FOR_MEEPLE_ACTION'),
    SELECT_TILE_FOR_MOVEMENT: require('./actions/SELECT_TILE_FOR_MOVEMENT'),
    SELECT_TILE_FOR_PLACEMENT: require('./actions/SELECT_TILE_FOR_PLACEMENT'),
    SELECT_TURN_ORDER_SPOT: require('./actions/SELECT_TURN_ORDER_SPOT'),
    TAKE_CONTROL_OF_TILE: require('./actions/TAKE_CONTROL_OF_TILE'),
    TAKE_CONTROL_OF_TILE_AFTER_ASSASSINATION: require('./actions/TAKE_CONTROL_OF_TILE_AFTER_ASSASSINATION'),
};

module.exports = {
    ...actions,
    findById: id => Object.values(actions).find(action => action.id === id),
};
