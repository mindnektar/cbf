const states = require('./states');
const { meeples, resources, tiles } = require('./assets');

const canMakeMovementFromTile = (state, rowIndex, itemIndex, meepleIds, meepleCount) => {
    const meepleNames = meepleIds.map(meeple => meeples[meeple]);
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
                    meeple => meepleNames.includes(meeples[meeple])
                )
            ) {
                return true;
            }
        }
    }

    return false;
};

const setEndOfTurnState = (nextState) => {
    const { turnOrder } = nextState.public.game;
    const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
    const nextPlayer = occupiedTurnOrderSpots[occupiedTurnOrderSpots.length - 1];

    if (nextPlayer !== undefined && nextState.currentPlayer === nextPlayer) {
        nextState.state = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK.id;
    } else {
        nextState.state = states.END_TURN.id;
    }

    nextState.public.game.dropHistory = [];
    nextState.public.game.collectedMeepleCount = null;
    nextState.public.game.collectedMeepleType = null;
};

const setMeepleActionState = (nextState) => {
    const { collectedMeepleType } = nextState.public.game;
    const hasFakir = nextState.private.players[nextState.currentPlayer].resources.find(
        resource => resources[resource] === 'Fakir'
    );

    if (collectedMeepleType === 'Merchant') {
        if (hasFakir) {
            nextState.state = states.SELECT_FAKIRS_FOR_MEEPLE_ACTION.id;
        } else {
            nextState.state = states.COLLECT_MARKET_RESOURCES.id;
        }
    } else if (collectedMeepleType === 'Builder') {
        if (hasFakir) {
            nextState.state = states.SELECT_FAKIRS_FOR_MEEPLE_ACTION.id;
        } else {
            nextState.state = states.COLLECT_GOLD_COINS.id;
        }
    } else if (collectedMeepleType === 'Assassin') {
        if (hasFakir) {
            nextState.state = states.SELECT_FAKIRS_FOR_MEEPLE_ACTION.id;
        } else {
            nextState.state = states.SELECT_MEEPLE_TO_KILL.id;
        }
    } else {
        setTileActionState(nextState);
    }
};

const setTileActionState = (nextState) => {
    const { board, dropHistory, palmTreeCount, palaceCount } = nextState.public.game;
    const rowIndex = dropHistory[dropHistory.length - 1][0];
    const itemIndex = dropHistory[dropHistory.length - 1][1];

    switch (tiles[board[rowIndex][itemIndex][0]].action) {
        case 'Oasis': {
            if (palmTreeCount > 0) {
                nextState.state = states.PLACE_PALM_TREE.id;
            } else {
                setEndOfTurnState(nextState);
            }

            break;
        }

        case 'Village': {
            if (palaceCount > 0) {
                nextState.state = states.PLACE_PALACE.id;
            } else {
                setEndOfTurnState(nextState);
            }

            break;
        }

        case 'Small market': nextState.state = states.GO_TO_SMALL_MARKET.id; break;
        case 'Big market': nextState.state = states.GO_TO_BIG_MARKET.id; break;
        default: nextState.state = states.COLLECT_DJINN.id;
    }
};

module.exports = {
    canMakeMovementFromTile,
    setEndOfTurnState,
    setMeepleActionState,
    setTileActionState,
};
