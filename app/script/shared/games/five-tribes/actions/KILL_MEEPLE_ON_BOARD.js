const clone = require('clone');
const states = require('../states');
const { meeples } = require('../assets');
const { setTileActionState } = require('../helpers');

module.exports = {
    id: 9,

    toString: ({ me, previousState, state }) => {
        const [rowIndex, itemIndex, meepleIndex] = state.action[1];
        const meeple = previousState.public.game.board[rowIndex][itemIndex][1][meepleIndex];

        let article = 'a';

        if (['Assassin', 'Elder'].includes(meeples[meeple])) {
            article = 'an';
        }

        return `${me.username} kills ${article} ${meeples[meeple].toLowerCase()} on the tile at position ${rowIndex}-${itemIndex}.`;
    },

    isValid: (state, [rowIndex, itemIndex, meepleIndex]) => {
        if (state.state !== states.SELECT_MEEPLE_TO_KILL.id) {
            return false;
        }

        const { board, collectedMeepleCount, dropHistory } = state.public.game;
        const distance =
            Math.abs(rowIndex - dropHistory[dropHistory.length - 1][0]) +
            Math.abs(itemIndex - dropHistory[dropHistory.length - 1][1]);

        return (
            distance <= collectedMeepleCount &&
            board[rowIndex][itemIndex][1][meepleIndex] !== undefined
        );
    },

    perform: (state, [rowIndex, itemIndex, meepleIndex]) => {
        const nextState = clone(state);

        const killedMeeple = nextState.public.game.board[rowIndex][itemIndex][1].splice(
            meepleIndex, 1
        );

        nextState.private.game.remainingMeeples = [
            ...nextState.private.game.remainingMeeples,
            ...killedMeeple,
        ];

        if (
            nextState.public.game.board[rowIndex][itemIndex][1].length === 0 &&
            nextState.public.game.board[rowIndex][itemIndex][2] === null &&
            nextState.public.players[nextState.currentPlayer].camelCount > 0
        ) {
            nextState.state = states.TAKE_CONTROL_OF_TILE_AFTER_ASSASSINATION.id;
        } else {
            setTileActionState(nextState);
        }

        return nextState;
    },
};
