const clone = require('clone');
const states = require('../states');
const { canMakeMovementFromTile } = require('../helpers');

module.exports = {
    id: 2,

    toString: ({ me, state }) => {
        const [rowIndex, itemIndex] = state.action[1];

        return `${me.username} selects the tile at position ${rowIndex}-${itemIndex} to start moving meeples.`;
    },

    isValid: (state, [rowIndex, itemIndex]) => {
        if (state.state !== states.SELECT_TILE_FOR_MOVEMENT.id) {
            return false;
        }

        const selectedTile = state.public.game.board[rowIndex][itemIndex];

        return canMakeMovementFromTile(
            state, rowIndex, itemIndex, selectedTile[1], selectedTile[1].length
        );
    },

    perform: (state, [rowIndex, itemIndex]) => {
        const nextState = clone(state);

        // Pick up all meeples from the selected spot
        nextState.public.game.meeplesInHand = [
            ...nextState.public.game.board[rowIndex][itemIndex][1],
        ];

        // Remove all meeples from the selected spot
        nextState.public.game.board[rowIndex][itemIndex][1] = [];

        // Remember where the move was started
        nextState.public.game.dropHistory.push([rowIndex, itemIndex]);

        nextState.state = states.SELECT_TILE_FOR_PLACEMENT.id;

        return nextState;
    },
};
