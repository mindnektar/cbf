const clone = require('clone');

const allMeeples = [
    ...Array(16).fill('Vizier'),
    ...Array(20).fill('Elder'),
    ...Array(18).fill('Merchant'),
    ...Array(18).fill('Builder'),
    ...Array(18).fill('Assassin'),
];
const allResources = [
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
    EXECUTE_MEEPLE_ACTION: 13,
    SPEND_FAKIR_ON_MEEPLE_ACTION: 14,
    COLLECT_MARKET_RESOURCES: 15,
    COLLECT_GOLD_COINS: 16,
    TAKE_CONTROL_OF_TILE: 17,
    EXECUTE_TILE_ACTION: 18,
};
const actions = {
    SELECT_TURN_ORDER_SPOT: 0,
    MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK: 1,
    SELECT_TILE_FOR_MOVEMENT: 2,
    SELECT_TILE_FOR_PLACEMENT: 3,
    PLACE_MEEPLE: 4,
    PICK_UP_MEEPLE: 5,
    TAKE_CONTROL_OF_TILE: 6,
    COLLECT_MARKET_RESOURCES: 7,
    END_TURN: 100,
};

const canMakeMovementFromTile = (state, rowIndex, itemIndex, meeples, meepleCount) => {
    const meepleNames = meeples.map(meeple => allMeeples[meeple]);
    const { board, dropHistory } = state.public.game;

    for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board[i].length; j += 1) {
            const distance = Math.abs(rowIndex - i) + Math.abs(itemIndex - j);

            if (
                dropHistory.length >= 1 &&
                dropHistory[dropHistory.length - 1][0] === i &&
                dropHistory[dropHistory.length - 1][1] === j
            ) {
                continue;
            }

            if (
                dropHistory.length >= 2 &&
                dropHistory[dropHistory.length - 2][0] === i &&
                dropHistory[dropHistory.length - 2][1] === j
            ) {
                continue;
            }

            if (
                distance !== 0 &&
                distance <= meepleCount &&
                distance % 2 === meepleCount % 2 &&
                board[i][j][1].some(
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
        resources: allResources,
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
        [actions.SELECT_TURN_ORDER_SPOT]: (user, state) => {
            const [spotIndex] = state.action[1];
            const cost = turnOrderTrack[spotIndex];

            if (cost === 0) {
                return `${user.username} pays nothing for ${user.gender === 0 ? 'his' : 'her'} spot on the turn order track.`;
            }

            return `${user.username} pays ${cost} gold coin${cost !== 1 ? 's' : ''} for ${user.gender === 0 ? 'his' : 'her'} spot on the turn order track.`;
        },
        [actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK]: user => (
            `${user.username} moves ${user.gender === 0 ? 'his' : 'her'} player marker to the bid order track.`
        ),
        [actions.SELECT_TILE_FOR_MOVEMENT]: (user, state) => {
            const [rowIndex, itemIndex] = state.action[1];

            return `${user.username} selects the tile at position ${rowIndex}-${itemIndex} to start moving meeples.`;
        },
        [actions.SELECT_TILE_FOR_PLACEMENT]: (user, state) => {
            const [rowIndex, itemIndex] = state.action[1];

            return `${user.username} selects the tile at position ${rowIndex}-${itemIndex} to drop a meeple.`;
        },
        [actions.PLACE_MEEPLE]: (user, state) => {
            const [meeple] = state.action[1][0];
            let article = 'a';

            if (['Assassin', 'Elder'].includes(allMeeples[meeple])) {
                article = 'an';
            }

            return `${user.username} drops ${article} ${allMeeples[meeple].toLowerCase()}.`;
        },
        [actions.PICK_UP_MEEPLE]: (user, state, previousState) => {
            const { board, dropHistory } = previousState.public.game;
            const rowIndex = dropHistory[dropHistory.length - 1][0];
            const itemIndex = dropHistory[dropHistory.length - 1][1];
            const meeplesOnTile = board[rowIndex][itemIndex][1];
            const meepleType = allMeeples[meeplesOnTile[meeplesOnTile.length - 1]];
            const meepleCount = meeplesOnTile.filter(
                meeple => allMeeples[meeple] === meepleType
            ).length;

            return `${user.username} picks up ${meepleCount} ${meepleType.toLowerCase()}s.`;
        },
        [actions.TAKE_CONTROL_OF_TILE]: (user, state) => {
            const { dropHistory } = state.public.game;
            const rowIndex = dropHistory[dropHistory.length - 1][0];
            const itemIndex = dropHistory[dropHistory.length - 1][1];

            return `${user.username} takes control of the tile at position ${rowIndex}-${itemIndex} and places one of ${user.gender === 0 ? 'his' : 'her'} camels there.`;
        },
        [actions.COLLECT_MARKET_RESOURCES]: (user, state, previousState) => {
            const previousPlayerData = previousState.public.players[previousState.currentPlayer];
            const playerData = state.public.players[previousState.currentPlayer];
            const resourceCount = playerData.resourceCount - previousPlayerData.resourceCount;

            if (state.public.game.availableResources.length === 0) {
                return `${user.username} collects all the remaining resources from the market.`;
            }

            return `${user.username} collects the first ${resourceCount} resources from the market.`;
        },
        [actions.END_TURN]: user => (
            `${user.username} ends ${user.gender === 0 ? 'his' : 'her'} turn.`
        ),
    },
    validators: {
        [actions.SELECT_TURN_ORDER_SPOT]: (state, [spotIndex]) => {
            if (state.state !== states.BID_FOR_TURN_ORDER) {
                return false;
            }

            const { currentPlayer } = state;
            const { goldCoinCount } = state.private.players[currentPlayer];
            const { turnOrder } = state.public.game;
            const isSpotFree = turnOrder[spotIndex] === null;
            const isSpotAffordable = goldCoinCount >= turnOrderTrack[spotIndex];

            if (turnOrderTrack[spotIndex] === 0) {
                for (let i = spotIndex - 1; i >= 0; i -= 1) {
                    if (turnOrder[i] === null) {
                        return false;
                    }
                }
            }

            return isSpotFree && isSpotAffordable;
        },
        [actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK]: state => (
            state.state === states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK
        ),
        [actions.SELECT_TILE_FOR_MOVEMENT]: (state, [rowIndex, itemIndex]) => {
            if (state.state !== states.SELECT_TILE_FOR_MOVEMENT) {
                return false;
            }

            const selectedTile = state.public.game.board[rowIndex][itemIndex];

            return canMakeMovementFromTile(
                state, rowIndex, itemIndex, selectedTile[1], selectedTile[1].length
            );
        },
        [actions.SELECT_TILE_FOR_PLACEMENT]: (state, [rowIndex, itemIndex]) => {
            if (state.state !== states.SELECT_TILE_FOR_PLACEMENT) {
                return false;
            }

            const { board, dropHistory, meeplesInHand } = state.public.game;
            const horizontalDistance = Math.abs(rowIndex - dropHistory[dropHistory.length - 1][0]);
            const verticalDistance = Math.abs(itemIndex - dropHistory[dropHistory.length - 1][1]);

            if (
                (
                    (horizontalDistance === 1 && verticalDistance === 0) ||
                    (horizontalDistance === 0 && verticalDistance === 1)
                ) &&
                (
                    !dropHistory[dropHistory.length - 2] ||
                    (
                        dropHistory[dropHistory.length - 2][0] !== rowIndex ||
                        dropHistory[dropHistory.length - 2][1] !== itemIndex
                    )
                )
            ) {
                if (meeplesInHand.length === 1) {
                    const meeplesOnTile = board[rowIndex][itemIndex][1].map(
                        meeple => allMeeples[meeple]
                    );

                    return meeplesOnTile.includes(allMeeples[meeplesInHand[0]]);
                }

                return canMakeMovementFromTile(
                    state, rowIndex, itemIndex, meeplesInHand, meeplesInHand.length - 1
                );
            }

            return false;
        },
        [actions.PLACE_MEEPLE]: (state, [selectedMeeple]) => {
            if (state.state !== states.SELECT_MEEPLE_TO_PLACE) {
                return false;
            }

            const { board, dropHistory, meeplesInHand } = state.public.game;
            const rowIndex = dropHistory[dropHistory.length - 1][0];
            const itemIndex = dropHistory[dropHistory.length - 1][1];
            const meeplesOnTile = board[rowIndex][itemIndex][1].map(
                meeple => allMeeples[meeple]
            );
            const meeplesOnHandAfterPlacement = meeplesInHand.filter(
                meeple => meeple !== selectedMeeple
            );

            if (meeplesInHand.length === 1) {
                return meeplesOnTile.includes(allMeeples[selectedMeeple]);
            }

            return canMakeMovementFromTile(
                state,
                rowIndex,
                itemIndex,
                meeplesOnHandAfterPlacement,
                meeplesOnHandAfterPlacement.length
            );
        },
        [actions.PICK_UP_MEEPLE]: state => (
            state.state === states.EXECUTE_MEEPLE_ACTION
        ),
        [actions.TAKE_CONTROL_OF_TILE]: state => (
            state.state === states.TAKE_CONTROL_OF_TILE
        ),
        [actions.COLLECT_MARKET_RESOURCES]: state => (
            state.state === states.COLLECT_MARKET_RESOURCES
        ),
        [actions.END_TURN]: state => (
            state.state === states.END_TURN
        ),
    },
    transformers: {
        [actions.SELECT_TURN_ORDER_SPOT]: (state, [spotIndex]) => {
            const nextState = clone(state);
            const { bidOrder, turnOrder } = nextState.public.game;
            const { currentPlayer } = nextState;

            // Remove player marker from bid order track
            bidOrder[bidOrder.lastIndexOf(currentPlayer)] = null;

            // Put player marker on the selected turn order spot
            turnOrder[spotIndex] = currentPlayer;

            // Subtract the respective amount of money from the player's stash
            nextState.private.players[currentPlayer].goldCoinCount -= turnOrderTrack[spotIndex];

            // Bidding is over
            if (bidOrder.filter(spot => spot !== null).length === 0) {
                for (let i = turnOrder.length - 1; i >= 0; i -= 1) {
                    if (turnOrder[i] === null) {
                        continue;
                    }

                    // The active player is ahead on the turn order track, let him continue his turn
                    if (turnOrder[i] === currentPlayer) {
                        nextState.state = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK;
                    // Someone else is ahead on the turn order track
                    } else {
                        nextState.state = states.END_TURN;
                    }

                    break;
                }
            // Bidding continues with the same player
            } else if (bidOrder.filter(spot => spot !== null).pop() === currentPlayer) {
                nextState.state = states.BID_FOR_TURN_ORDER;
            // Bidding continues with another player
            } else {
                nextState.state = states.END_TURN;
            }

            return nextState;
        },
        [actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK]: (state) => {
            const nextState = clone(state);
            const { nextTurnsBidOrder, turnOrder } = nextState.public.game;
            const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
            const player = occupiedTurnOrderSpots.pop();

            nextTurnsBidOrder[nextTurnsBidOrder.lastIndexOf(null)] = player;
            turnOrder[turnOrder.lastIndexOf(player)] = null;

            nextState.state = states.SELECT_TILE_FOR_MOVEMENT;

            return nextState;
        },
        [actions.SELECT_TILE_FOR_MOVEMENT]: (state, [rowIndex, itemIndex]) => {
            const nextState = clone(state);

            // Pick up all meeples from the selected spot
            nextState.public.game.meeplesInHand = [
                ...nextState.public.game.board[rowIndex][itemIndex][1],
            ];

            // Remove all meeples from the selected spot
            nextState.public.game.board[rowIndex][itemIndex][1] = [];

            // Remember where the move was started
            nextState.public.game.dropHistory.push([rowIndex, itemIndex]);

            nextState.state = states.SELECT_TILE_FOR_PLACEMENT;

            return nextState;
        },
        [actions.SELECT_TILE_FOR_PLACEMENT]: (state, [rowIndex, itemIndex]) => {
            const nextState = clone(state);

            nextState.public.game.dropHistory.push([rowIndex, itemIndex]);

            nextState.state = states.SELECT_MEEPLE_TO_PLACE;

            return nextState;
        },
        [actions.PLACE_MEEPLE]: (state, [meeple]) => {
            const nextState = clone(state);

            const { dropHistory } = state.public.game;
            const rowIndex = dropHistory[dropHistory.length - 1][0];
            const itemIndex = dropHistory[dropHistory.length - 1][1];

            nextState.public.game.meeplesInHand.splice(
                nextState.public.game.meeplesInHand.indexOf(meeple), 1
            );

            nextState.public.game.board[rowIndex][itemIndex][1].push(meeple);

            if (nextState.public.game.meeplesInHand.length === 0) {
                nextState.state = states.EXECUTE_MEEPLE_ACTION;
            } else {
                nextState.state = states.SELECT_TILE_FOR_PLACEMENT;
            }

            return nextState;
        },
        [actions.PICK_UP_MEEPLE]: (state) => {
            const nextState = clone(state);

            const { board, dropHistory } = nextState.public.game;
            const rowIndex = dropHistory[dropHistory.length - 1][0];
            const itemIndex = dropHistory[dropHistory.length - 1][1];
            const meeplesOnTile = board[rowIndex][itemIndex][1];
            const meepleType = allMeeples[meeplesOnTile[meeplesOnTile.length - 1]];
            const collectedMeeples = meeplesOnTile.filter(
                meeple => allMeeples[meeple] === meepleType
            );
            const remainingMeeples = meeplesOnTile.filter(
                meeple => allMeeples[meeple] !== meepleType
            );
            const meepleCount = collectedMeeples.length;

            board[rowIndex][itemIndex][1] = remainingMeeples;

            nextState.public.game.collectedMeepleType = meepleType;

            switch (meepleType) {
                case 'Vizier':
                    nextState.public.players[nextState.currentPlayer].vizierCount += meepleCount;
                    nextState.state = states.EXECUTE_TILE_ACTION;
                    break;

                case 'Elder':
                    nextState.public.players[nextState.currentPlayer].elderCount += meepleCount;
                    nextState.state = states.EXECUTE_TILE_ACTION;
                    break;

                default:
                    nextState.private.game.remainingMeeples = [
                        ...nextState.private.game.remainingMeeples,
                        ...collectedMeeples,
                        nextState.action[1][0],
                    ];

                    nextState.public.game.collectedMeepleCount = meepleCount;
            }

            if (board[rowIndex][itemIndex][1].length === 0) {
                nextState.state = states.TAKE_CONTROL_OF_TILE;
            } else {
                const hasFakir = nextState.private.players[nextState.currentPlayer].resources.find(
                    resource => allResources[resource] === 'Fakir'
                );

                if (meepleType === 'Merchant') {
                    if (hasFakir) {
                        nextState.state = states.SPEND_FAKIR_ON_MEEPLE_ACTION;
                    } else {
                        nextState.state = states.COLLECT_MARKET_RESOURCES;
                    }
                } else if (meepleType === 'Builder') {
                    if (hasFakir) {
                        nextState.state = states.SPEND_FAKIR_ON_MEEPLE_ACTION;
                    } else {
                        nextState.state = states.COLLECT_GOLD_COINS;
                    }
                } else if (meepleType === 'Assassin') {
                    if (hasFakir) {
                        nextState.state = states.SPEND_FAKIR_ON_MEEPLE_ACTION;
                    } else {
                        nextState.state = states.SELECT_MEEPLE_TO_KILL;
                    }
                }
            }

            return nextState;
        },
        [actions.TAKE_CONTROL_OF_TILE]: (state) => {
            const nextState = clone(state);

            const { board, collectedMeepleType, dropHistory } = nextState.public.game;
            const rowIndex = dropHistory[dropHistory.length - 1][0];
            const itemIndex = dropHistory[dropHistory.length - 1][1];

            board[rowIndex][itemIndex][2] = nextState.currentPlayer;

            nextState.public.players[nextState.currentPlayer].camelCount -= 1;

            const hasFakir = nextState.private.players[nextState.currentPlayer].resources.find(
                resource => allResources[resource] === 'Fakir'
            );

            if (collectedMeepleType === 'Merchant') {
                if (hasFakir) {
                    nextState.state = states.SPEND_FAKIR_ON_MEEPLE_ACTION;
                } else {
                    nextState.state = states.COLLECT_MARKET_RESOURCES;
                }
            } else if (collectedMeepleType === 'Builder') {
                if (hasFakir) {
                    nextState.state = states.SPEND_FAKIR_ON_MEEPLE_ACTION;
                } else {
                    nextState.state = states.COLLECT_GOLD_COINS;
                }
            } else if (collectedMeepleType === 'Assassin') {
                if (hasFakir) {
                    nextState.state = states.SPEND_FAKIR_ON_MEEPLE_ACTION;
                } else {
                    nextState.state = states.SELECT_MEEPLE_TO_KILL;
                }
            } else {
                nextState.state = states.EXECUTE_TILE_ACTION;
            }

            return nextState;
        },
        [actions.COLLECT_MARKET_RESOURCES]: (state) => {
            const nextState = clone(state);

            const { collectedMeepleCount } = nextState.public.game;

            const resources = nextState.public.game.availableResources.splice(
                0, collectedMeepleCount
            );

            nextState.public.players[state.currentPlayer].resourceCount += resources.length;

            nextState.private.players[state.currentPlayer].resources = [
                ...nextState.private.players[state.currentPlayer].resources,
                ...resources,
            ];

            nextState.state = states.EXECUTE_TILE_ACTION;

            return nextState;
        },
        [actions.END_TURN]: (state) => {
            const nextState = clone(state);
            const bidOrder = nextState.public.game.bidOrder.filter(spot => spot !== null);

            // There are still players on the bid order track, so continue bidding
            if (bidOrder.length > 0) {
                nextState.state = states.BID_FOR_TURN_ORDER;
                nextState.currentPlayer = bidOrder.pop();
            // Nobody on the bid order track, so continue with regular actions
            } else {
                const { turnOrder } = nextState.public.game;
                const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
                const player = occupiedTurnOrderSpots.pop();

                nextState.state = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK;
                nextState.currentPlayer = player;
            }

            return nextState;
        },
    },
};
