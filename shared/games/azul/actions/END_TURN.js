const states = require('../states');

module.exports = {
    id: 0,
    isServerAction: true,

    toString: ({ me }) => (
        `${me.name} ends their turn.`
    ),

    isValid: ({ state }) => (
        state.state === states.END_TURN.id
    ),

    perform: ({ state, player }) => {
        const { centerTiles, factoryTiles, playerOrder } = state.game;
        let nextState;
        let activePlayers;

        if (factoryTiles.some((display) => display.length > 0) || centerTiles.length > 0) {
            let playerIndex = playerOrder.indexOf(player.id) + 1;

            if (playerIndex === playerOrder.length) {
                playerIndex = 0;
            }

            nextState = states.PICK_UP_TILES.id;
            activePlayers = [playerOrder[playerIndex]];
        } else {
            nextState = states.SCORE_FINISHED_LINES.id;
            activePlayers = [playerOrder[0]];
        }

        return {
            ...state,
            activePlayers,
            state: nextState,
        };
    },
};
