const states = require('../states');

module.exports = {
    id: 4,
    isServerAction: true,
    isEndGameAction: true,

    formatScores: (values) => (
        [`${values[0]} points`, `${values[1]} rows`]
    ),

    getScores: ({ state }) => (
        Object.entries(state.players).map(([id, player]) => ({
            id,
            scores: [
                player.score,
                player.wall.filter((line) => !line.includes(null)).length,
            ],
        }))
    ),

    toString: () => (
        'The game is over.'
    ),

    isValid: ({ state }) => (
        state.state === states.END_GAME.id
    ),
};
