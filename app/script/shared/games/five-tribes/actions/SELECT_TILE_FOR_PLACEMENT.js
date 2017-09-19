const clone = require('clone');
const states = require('../states');
const { meeples } = require('../assets');
const { canMakeMovementFromTile } = require('../helpers');

module.exports = {
    id: 3,

    toString: ({ me, state }) => {
        const [rowIndex, itemIndex] = state.action[1];

        return `${me.username} selects the tile at position ${rowIndex}-${itemIndex} to drop a meeple.`;
    },

    isValid: (state, [rowIndex, itemIndex]) => {
        if (state.state !== states.SELECT_TILE_FOR_PLACEMENT.id) {
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
                    meeple => meeples[meeple]
                );

                return meeplesOnTile.includes(meeples[meeplesInHand[0]]);
            }

            return canMakeMovementFromTile(
                state, rowIndex, itemIndex, meeplesInHand, meeplesInHand.length - 1
            );
        }

        return false;
    },

    perform: (state, [rowIndex, itemIndex]) => {
        const nextState = clone(state);

        nextState.public.game.dropHistory.push([rowIndex, itemIndex]);

        nextState.state = states.SELECT_MEEPLE_TO_PLACE.id;

        return nextState;
    },
};
