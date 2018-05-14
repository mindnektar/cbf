const clone = require('clone');
const states = require('../states');
const { setEndOfTurnState } = require('../helpers');

module.exports = {
    id: 14,

    toString: ({ me, previousState }) => {
        const { dropHistory } = previousState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        return `${me.username} places a palm tree on the tile at position ${rowIndex}-${itemIndex}.`;
    },

    isValid: state => (
        state.state === states.PLACE_PALM_TREE.id
    ),

    perform: (state) => {
        const nextState = clone(state);
        const { dropHistory } = nextState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        nextState.public.game.palmTreeCount -= 1;

        nextState.public.game.board[rowIndex][itemIndex][3] += 1;

        setEndOfTurnState(nextState);

        return nextState;
    },
};
