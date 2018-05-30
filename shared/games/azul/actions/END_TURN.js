const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 0,
    isServerAction: true,

    toString: ({ me }) => (
        `${me.username} ends their turn.`
    ),

    isValid: state => (
        state.state === states.END_TURN.id
    ),

    perform: (state, payload, players) => {
        const clonedState = clone(state);
        const { centerTiles, factoryTiles, playerOrder } = clonedState.public.game;
        let nextState;
        let { currentPlayer } = clonedState;

        if (factoryTiles.some(display => display.length > 0) || centerTiles.length > 0) {
            let playerIndex = playerOrder.indexOf(players.indexOf(currentPlayer)) + 1;

            if (playerIndex === playerOrder.length) {
                playerIndex = 0;
            }

            nextState = states.PICK_UP_TILES.id;
            currentPlayer = players[playerOrder[playerIndex]];
        } else {
            nextState = states.SCORE_FINISHED_LINES.id;
            currentPlayer = players[playerOrder[0]];
        }

        return {
            ...clonedState,
            currentPlayer,
            state: nextState,
        };
    },
};
