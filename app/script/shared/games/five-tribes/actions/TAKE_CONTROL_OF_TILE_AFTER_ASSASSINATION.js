const clone = require('clone');
const states = require('../states');
const { setTileActionState } = require('../helpers');

module.exports = {
    id: 13,

    toString: ({ me, previousState }) => {
        const [rowIndex, itemIndex] = previousState.action[1];

        return `${me.username} takes control of the tile at position ${rowIndex}-${itemIndex} and places one of ${me.gender === 0 ? 'his' : 'her'} camels there.`;
    },

    isValid: state => (
        state.state === states.TAKE_CONTROL_OF_TILE_AFTER_ASSASSINATION.id
    ),

    perform: (state) => {
        const nextState = clone(state);

        const { board } = nextState.public.game;
        const [rowIndex, itemIndex] = nextState.action[1];

        board[rowIndex][itemIndex][2] = nextState.currentPlayer;

        nextState.public.players[nextState.currentPlayer].camelCount -= 1;

        setTileActionState(nextState);

        return nextState;
    },
};
