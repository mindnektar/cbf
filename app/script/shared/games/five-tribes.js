const clone = require('clone');

const allMeeples = [
    ...Array(16).fill('Vizier'),
    ...Array(20).fill('Elder'),
    ...Array(18).fill('Merchant'),
    ...Array(18).fill('Builder'),
    ...Array(18).fill('Assassin'),
];
const turnOrderTrack = [0, 0, 0, 1, 3, 5, 8, 12, 18];
const states = {
    BID_FOR_TURN_ORDER: 0,
    MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK: 1,
    SELECT_TILE_FOR_MOVEMENT: 2,
    SELECT_TILE_FOR_PLACEMENT: 3,
    SELECT_MEEPLE_TO_PLACE: 4,
    USE_FAKIRS_TO_IMPROVE_MEEPLE_ACTION: 5,
    SELECT_MEEPLE_TO_KILL: 6,
    GO_TO_MARKET: 7,
    SELECT_RESOURCES_FROM_MARKET: 8,
    COLLECT_DJINN: 9,
    SELECT_DJINN_FROM_DISPLAY: 10,
    SELL_RESOURCES: 11,
    END_TURN: 12,
};
const actions = {
    SELECT_TURN_ORDER_SPOT: 0,
    MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK: 1,
    SELECT_TILE_FOR_MOVEMENT: 2,
    END_TURN: 100,
};

const canMakeMovementFromTile = (state, rowIndex, itemIndex, meeples, meepleCount) => {
    const meepleNames = meeples.map(meeple => allMeeples[meeple]);

    for (let i = 0; i < state[0][0][0].length; i += 1) {
        for (let j = 0; j < state[0][0][0][i].length; j += 1) {
            const distance = Math.abs(rowIndex - i) + Math.abs(itemIndex - j);

            if (
                distance !== 0 &&
                distance <= meepleCount &&
                distance % 2 === meepleCount % 2 &&
                state[0][0][0][i][j][1].some(
                    meeple => meepleNames.includes(allMeeples[meeple])
                )
            ) {
                return true;
            }
        }
    }

    return false;
};

module.exports = {
    assets: {
        meeples: allMeeples,
        tiles: [
            ...Array(4).fill({ color: 'red', value: 4, action: 'Big market' }),
            ...Array(8).fill({ color: 'red', value: 6, action: 'Small market' }),
            ...Array(6).fill({ color: 'red', value: 8, action: 'Oasis' }),
            ...Array(5).fill({ color: 'blue', value: 5, action: 'Village' }),
            ...Array(4).fill({ color: 'blue', value: 6, action: 'Sacred place' }),
            { color: 'blue', value: 10, action: 'Sacred place' },
            { color: 'blue', value: 12, action: 'Sacred place' },
            { color: 'blue', value: 15, action: 'Sacred place' },
        ],
        resources: [
            ...Array(2).fill('Ivory'),
            ...Array(2).fill('Jewels'),
            ...Array(2).fill('Gold'),
            ...Array(4).fill('Papyrus'),
            ...Array(4).fill('Silk'),
            ...Array(4).fill('Spice'),
            ...Array(6).fill('Fish'),
            ...Array(6).fill('Wheat'),
            ...Array(6).fill('Pottery'),
            ...Array(18).fill('Fakir'),
        ],
        djinns: [
            { name: 'Al-Amin', value: 5, hasAction: false },
            { name: 'Anun-Nak', value: 8, hasAction: true },
            { name: 'Ba\'al', value: 6, hasAction: false },
            { name: 'Boaz', value: 6, hasAction: false },
            { name: 'Bouraq', value: 6, hasAction: true },
            { name: 'Echidna', value: 4, hasAction: true },
            { name: 'Enki', value: 8, hasAction: true },
            { name: 'Hagis', value: 10, hasAction: false },
            { name: 'Haurvatat', value: 8, hasAction: false },
            { name: 'Iblis', value: 8, hasAction: false },
            { name: 'Jafaar', value: 6, hasAction: false },
            { name: 'Kandicha', value: 6, hasAction: false },
            { name: 'Kumarbi', value: 6, hasAction: false },
            { name: 'Lamia', value: 10, hasAction: false },
            { name: 'Leta', value: 4, hasAction: true },
            { name: 'Marid', value: 6, hasAction: false },
            { name: 'Monkir', value: 6, hasAction: false },
            { name: 'Nekir', value: 6, hasAction: false },
            { name: 'Shamhat', value: 6, hasAction: false },
            { name: 'Sibittis', value: 4, hasAction: true },
            { name: 'Sloar', value: 8, hasAction: true },
            { name: 'Utug', value: 4, hasAction: true },
        ],
        palmTrees: 12,
        palaces: 10,
        turnOrderTrack,
    },
    states,
    actions,
    messages: {
        [actions.SELECT_TURN_ORDER_SPOT]: (user, state, [spotIndex]) => {
            const cost = turnOrderTrack[spotIndex];

            if (cost === 0) {
                return `${user.username} pays nothing for ${user.gender === 0 ? 'his' : 'her'} spot on the turn order track.`;
            }

            return `${user.username} pays ${cost} gold coin${cost !== 1 ? 's' : ''} for ${user.gender === 0 ? 'his' : 'her'} spot on the turn order track.`;
        },
        [actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK]: user => (
            `${user.username} moves ${user.gender === 0 ? 'his' : 'her'} player marker to the bid order track.`
        ),
        [actions.SELECT_TILE_FOR_MOVEMENT]: (user, state, [rowIndex, itemIndex]) => (
            `${user.username} selects the tile at position ${rowIndex}-${itemIndex} to start moving meeples.`
        ),
        [actions.SELECT_TILE_FOR_PLACEMENT]: (user, state, [rowIndex, itemIndex]) => (
            `${user.username} selects the tile at position ${rowIndex}-${itemIndex} to drop a meeple.`
        ),
        [actions.END_TURN]: user => (
            `${user.username} ends ${user.gender === 0 ? 'his' : 'her'} turn.`
        ),
    },
    validators: {
        [actions.SELECT_TURN_ORDER_SPOT]: (state, [spotIndex]) => {
            if (state[2] !== states.BID_FOR_TURN_ORDER) {
                return false;
            }

            const currentPlayer = state[4];
            const isSpotFree = state[0][0][8][spotIndex] === null;
            const isSpotAffordable = state[1][1][currentPlayer][0] >= turnOrderTrack[spotIndex];

            if (turnOrderTrack[spotIndex] === 0) {
                for (let i = spotIndex - 1; i >= 0; i -= 1) {
                    if (state[0][0][8][i] === null) {
                        return false;
                    }
                }
            }

            return isSpotFree && isSpotAffordable;
        },
        [actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK]: state => (
            state[2] === states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK
        ),
        [actions.SELECT_TILE_FOR_MOVEMENT]: (state, [rowIndex, itemIndex]) => {
            if (state[2] !== states.SELECT_TILE_FOR_MOVEMENT) {
                return false;
            }

            const selectedTile = state[0][0][0][rowIndex][itemIndex];

            return canMakeMovementFromTile(
                state, rowIndex, itemIndex, selectedTile[1], selectedTile[1].length
            );
        },
        [actions.SELECT_TILE_FOR_PLACEMENT]: (state, [rowIndex, itemIndex]) => {
            if (state[2] !== states.SELECT_TILE_FOR_PLACEMENT) {
                return false;
            }

            const dropHistory = state[0][0][11];
            const horizontalDistance = Math.abs(rowIndex - dropHistory[dropHistory.length - 1][0]);
            const verticalDistance = Math.abs(itemIndex - dropHistory[dropHistory.length - 1][1]);

            return (
                (
                    (horizontalDistance === 1 && verticalDistance === 0) ||
                    (horizontalDistance === 0 && verticalDistance === 1)
                ) &&
                (
                    !dropHistory[dropHistory.length - 2] ||
                    (
                        dropHistory[dropHistory.length - 2][0] !== rowIndex &&
                        dropHistory[dropHistory.length - 2][1] !== itemIndex
                    )
                ) &&
                canMakeMovementFromTile(
                    state, rowIndex, itemIndex, state[0][0][10], state[0][0][10].length - 1
                )
            );
        },
        [actions.END_TURN]: state => (
            state[2] === states.END_TURN
        ),
    },
    transformers: {
        [actions.SELECT_TURN_ORDER_SPOT]: (state, [spotIndex]) => {
            const nextState = clone(state);
            const bidOrder = nextState[0][0][7];
            const currentPlayer = nextState[4];
            const turnOrder = nextState[0][0][8];

            // Remove player marker from bid order track
            bidOrder[bidOrder.lastIndexOf(currentPlayer)] = null;

            // Put player marker on the selected turn order spot
            turnOrder[spotIndex] = currentPlayer;

            // Subtract the respective amount of money from the player's stash
            nextState[1][1][currentPlayer][0] -= turnOrderTrack[spotIndex];

            // Bidding is over
            if (bidOrder.filter(spot => spot !== null).length === 0) {
                for (let i = turnOrder.length - 1; i >= 0; i -= 1) {
                    if (turnOrder[i] === null) {
                        continue;
                    }

                    // The active player is ahead on the turn order track, let him continue his turn
                    if (turnOrder[i] === currentPlayer) {
                        nextState[2] = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK;
                    // Someone else is ahead on the turn order track
                    } else {
                        nextState[2] = states.END_TURN;
                    }

                    break;
                }
            // Bidding continues with the same player
            } else if (bidOrder.filter(spot => spot !== null).pop() === currentPlayer) {
                nextState[2] = states.BID_FOR_TURN_ORDER;
            // Bidding continues with another player
            } else {
                nextState[2] = states.END_TURN;
            }

            return nextState;
        },
        [actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK]: (state) => {
            const nextState = clone(state);
            const turnOrder = nextState[0][0][8];
            const nextTurnsBidOrder = nextState[0][0][9];
            const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
            const player = occupiedTurnOrderSpots.pop();

            nextTurnsBidOrder[nextTurnsBidOrder.lastIndexOf(null)] = player;
            turnOrder[turnOrder.lastIndexOf(player)] = null;

            nextState[2] = states.SELECT_TILE_FOR_MOVEMENT;

            return nextState;
        },
        [actions.SELECT_TILE_FOR_MOVEMENT]: (state, [rowIndex, itemIndex]) => {
            const nextState = clone(state);

            // Pick up all meeples from the selected spot
            nextState[0][0][10] = [...nextState[0][0][0][rowIndex][itemIndex][1]];

            // Remove all meeples from the selected spot
            nextState[0][0][0][rowIndex][itemIndex][1] = [];

            // Remember where the move was started
            nextState[0][0][11].push([rowIndex, itemIndex]);

            nextState[2] = states.SELECT_TILE_FOR_PLACEMENT;

            return nextState;
        },
        [actions.SELECT_TILE_FOR_PLACEMENT]: (state, [rowIndex, itemIndex]) => {
            const nextState = clone(state);

            nextState[0][0][11].push([rowIndex, itemIndex]);

            nextState[2] = states.SELECT_MEEPLE_TO_PLACE;

            return nextState;
        },
        [actions.END_TURN]: (state) => {
            const nextState = clone(state);
            const bidOrder = nextState[0][0][7].filter(spot => spot !== null);

            // There are still players on the bid order track, so continue bidding
            if (bidOrder.length > 0) {
                nextState[2] = states.BID_FOR_TURN_ORDER;
                nextState[4] = bidOrder.pop();
            // Nobody on the bid order track, so continue with regular actions
            } else {
                const turnOrder = nextState[0][0][8];
                const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
                const player = occupiedTurnOrderSpots.pop();

                nextState[2] = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK;
                nextState[4] = player;
            }

            return nextState;
        },
    },
};
