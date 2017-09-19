const clone = require('clone');
const states = require('../states');
const { setEndOfTurnState } = require('../helpers');

module.exports = {
    id: 15,

    toString: ({ me, previousState }) => {
        const { dropHistory } = previousState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        return `${me.username} places a palace on the tile at position ${rowIndex}-${itemIndex}.`;
    },

    isValid: state => (
        state.state === states.PLACE_PALACE.id
    ),

    perform: (state) => {
        const nextState = clone(state);
        const { dropHistory } = nextState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        nextState.public.game.palaceCount -= 1;

        nextState.public.game.board[rowIndex][itemIndex][4] += 1;

        setEndOfTurnState(nextState);

        return nextState;
    },
};
