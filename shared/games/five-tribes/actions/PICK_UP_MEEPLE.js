const clone = require('clone');
const states = require('../states');
const { meeples } = require('../assets');
const { setMeepleActionState, setTileActionState } = require('../helpers');

module.exports = {
    id: 5,

    toString: ({ me, previousState }) => {
        const { board, dropHistory } = previousState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];
        const meeplesOnTile = board[rowIndex][itemIndex][1];
        const meepleType = meeples[meeplesOnTile[meeplesOnTile.length - 1]];
        const meepleCount = meeplesOnTile.filter(
            meeple => meeples[meeple] === meepleType
        ).length;

        return `${me.username} picks up ${meepleCount} ${meepleType.toLowerCase()}s.`;
    },

    isValid: state => (
        state.state === states.EXECUTE_MEEPLE_ACTION.id
    ),

    perform: (state) => {
        const nextState = clone(state);

        const { board, dropHistory } = nextState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];
        const meeplesOnTile = board[rowIndex][itemIndex][1];
        const meepleType = meeples[meeplesOnTile[meeplesOnTile.length - 1]];
        const collectedMeeples = meeplesOnTile.filter(
            meeple => meeples[meeple] === meepleType
        );
        const remainingMeeples = meeplesOnTile.filter(
            meeple => meeples[meeple] !== meepleType
        );
        const meepleCount = collectedMeeples.length;

        board[rowIndex][itemIndex][1] = remainingMeeples;

        nextState.public.game.collectedMeepleType = meepleType;

        if (
            board[rowIndex][itemIndex][1].length === 0 &&
            board[rowIndex][itemIndex][2] === null &&
            nextState.public.players[nextState.currentPlayer].camelCount > 0
        ) {
            nextState.state = states.TAKE_CONTROL_OF_TILE.id;
        } else if (meepleType === 'Vizier') {
            nextState.public.players[nextState.currentPlayer].viziers = [
                ...nextState.public.players[nextState.currentPlayer].viziers,
                ...collectedMeeples,
            ];

            setTileActionState(nextState);
        } else if (meepleType === 'Elder') {
            nextState.public.players[nextState.currentPlayer].elders = [
                ...nextState.public.players[nextState.currentPlayer].elders,
                ...collectedMeeples,
            ];

            setTileActionState(nextState);
        } else {
            nextState.private.game.remainingMeeples = [
                ...nextState.private.game.remainingMeeples,
                ...collectedMeeples,
            ];

            nextState.public.game.collectedMeepleCount = meepleCount;

            setMeepleActionState(nextState);
        }

        return nextState;
    },
};
