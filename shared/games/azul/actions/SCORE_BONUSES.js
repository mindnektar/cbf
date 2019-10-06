const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 5,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const score = state.players[me.id].score - previousState.players[me.id].score;

        return `${me.name} scores ${score} bonus point${score !== 1 ? 's' : ''}.`;
    },

    isValid: ({ state }) => (
        state.state === states.SCORE_BONUSES.id
    ),

    perform: ({ state }) => {
        const clonedState = clone(state);
        let nextState = clonedState.state;
        let { activePlayers } = clonedState;
        const { playerOrder } = clonedState.game;
        const { wall } = clonedState.players[activePlayers[0]];
        let { score } = clonedState.players[activePlayers[0]];

        score += wall.filter((line) => !line.includes(null)).length * 2;
        score += wall.filter((_, index) => wall.every((line) => line[index] !== null)).length * 7;
        score += wall.filter((_, index) => wall.every((line) => line.includes(index))).length * 10;

        const nextPlayerIndex = playerOrder.indexOf(activePlayers[0]) + 1;

        if (nextPlayerIndex === playerOrder.length) {
            nextState = states.END_GAME.id;
        } else {
            activePlayers = [playerOrder[nextPlayerIndex]];
        }

        return {
            ...clonedState,
            players: {
                ...clonedState.players,
                [clonedState.activePlayers[0]]: {
                    ...clonedState.players[clonedState.activePlayers[0]],
                    score,
                },
            },
            state: nextState,
            activePlayers,
        };
    },
};
