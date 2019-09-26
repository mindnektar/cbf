const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 5,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const score = state.public.players[me.id].score - previousState.public.players[me.id].score;

        return `${me.name} scores ${score} bonus point${score !== 1 ? 's' : ''}.`;
    },

    isValid: ({ state }) => (
        state.state === states.SCORE_BONUSES.id
    ),

    perform: ({ state, player }) => {
        const clonedState = clone(state);
        let nextState = clonedState.state;
        const { playerOrder } = clonedState.public.game;
        const { wall } = clonedState.public.players[player.id];
        let { score } = clonedState.public.players[player.id];
        let activePlayers = [player.id];

        score += wall.filter((line) => !line.includes(null)).length * 2;
        score += wall.filter((_, index) => wall.every((line) => line[index] !== null)).length * 7;
        score += wall.filter((_, index) => wall.every((line) => line.includes(index))).length * 10;

        const nextPlayerIndex = playerOrder.indexOf(player.id) + 1;

        if (nextPlayerIndex === playerOrder.length) {
            nextState = states.END_GAME.id;
        } else {
            activePlayers = [playerOrder[nextPlayerIndex]];
        }

        return {
            ...clonedState,
            public: {
                ...clonedState.public,
                players: {
                    ...clonedState.public.players,
                    [clonedState.currentPlayer]: {
                        ...clonedState.public.players[clonedState.currentPlayer],
                        score,
                    },
                },
            },
            state: nextState,
            activePlayers,
        };
    },
};
