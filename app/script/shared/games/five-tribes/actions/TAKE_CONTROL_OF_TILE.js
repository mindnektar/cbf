const clone = require('clone');
const states = require('../states');
const { setMeepleActionState, setTileActionState } = require('../helpers');

module.exports = {
    id: 6,

    toString: ({ me, state }) => {
        const { dropHistory } = state.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        return `${me.username} takes control of the tile at position ${rowIndex}-${itemIndex} and places one of ${me.gender === 0 ? 'his' : 'her'} camels there.`;
    },

    isValid: state => (
        state.state === states.TAKE_CONTROL_OF_TILE.id
    ),

    perform: (state) => {
        const nextState = clone(state);

        const { board, collectedMeepleType, dropHistory } = nextState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        board[rowIndex][itemIndex][2] = nextState.currentPlayer;

        nextState.public.players[nextState.currentPlayer].camelCount -= 1;

        if (['Vizier', 'Elder'].contains(collectedMeepleType)) {
            setTileActionState(nextState);
        } else {
            setMeepleActionState(nextState);
        }

        return nextState;
    },
};
