const states = require('../states');

module.exports = {
    id: 4,
    isServerAction: true,
    isEndGameAction: true,

    formatScores: (values) => (
        `${values[0]} point${values[0] !== 1 ? 's' : ''}, ${values[1]} row${values[1] !== 1 ? 's' : ''}`
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
