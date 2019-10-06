const states = require('../states');

module.exports = {
    id: 4,
    isServerAction: true,
    isEndGameAction: true,

    getScores: ({ state, players }) => (
        players
            .reduce((result, current) => [
                ...result,
                {
                    id: current.id,
                    score: state.players[current.id].score,
                },
            ], [])
            .sort((a, b) => a.score < b.score)
    ),

    toString: () => (
        'The game is over.'
    ),

    isValid: ({ state }) => (
        state.state === states.END_GAME.id
    ),
};
