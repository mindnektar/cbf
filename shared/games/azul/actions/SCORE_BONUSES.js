const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 5,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const score = state.public.players[me.id].score - previousState.public.players[me.id].score;

        return `${me.username} scores ${score} bonus point${score !== 1 ? 's' : ''}.`;
    },

    isValid: state => (
        state.state === states.SCORE_BONUSES.id
    ),

    perform: (state, payload, players) => {
        const clonedState = clone(state);
        let { currentPlayer } = clonedState;
        let nextState = clonedState.state;
        const { playerOrder } = clonedState.public.game;
        let { wall, score } = clonedState.public.players[currentPlayer];

        score += wall.filter(line => !line.includes(null)).length * 2;
        score += wall.filter((_, index) => wall.every(line => line[index] !== null)).length * 7;
        score += wall.filter((_, index) => wall.every(line => line.includes(index))).length * 10;

        const nextPlayerIndex = playerOrder.indexOf(players.indexOf(currentPlayer)) + 1;

        if (nextPlayerIndex === players.length) {
            nextState = states.END_GAME.id;
        } else {
            currentPlayer = players[playerOrder[nextPlayerIndex]];
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
            currentPlayer,
        };
    },
};
