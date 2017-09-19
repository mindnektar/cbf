const clone = require('clone');
const { states } = require('../../five-tribes');
const { tiles } = require('../assets');
const { setTileActionState } = require('../helpers');

module.exports = {
    id: 8,

    toString: ({ me, previousState, state }) => {
        const previousPlayerData = previousState.private.players[previousState.currentPlayer];
        const playerData = state.private.players[previousState.currentPlayer];
        const goldCoinCount = playerData.goldCoinCount - previousPlayerData.goldCoinCount;

        return `${me.username} collects ${goldCoinCount} gold coins.`;
    },

    isValid: state => (
        state.state === states.COLLECT_GOLD_COINS.id
    ),

    perform: (state) => {
        const nextState = clone(state);

        const { board, collectedMeepleCount, dropHistory } = nextState.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        let surroundingBlueTiles = 0;

        for (let i = 0; i < board.length; i += 1) {
            for (let j = 0; j < board[i].length; j += 1) {
                const horizontalDistance = Math.abs(rowIndex - i);
                const verticalDistance = Math.abs(itemIndex - j);

                if (
                    horizontalDistance <= 1 &&
                    verticalDistance <= 1 &&
                    tiles[board[i][j][0]].color === 'blue'
                ) {
                    surroundingBlueTiles += 1;
                }
            }
        }

        const goldCoins = surroundingBlueTiles * collectedMeepleCount;

        nextState.private.players[nextState.currentPlayer].goldCoinCount += goldCoins;

        setTileActionState(nextState);

        return nextState;
    },
};
