const shuffle = require('knuth-shuffle').knuthShuffle;
const assets = require('./assets');
const states = require('./states');

module.exports = (players) => {
    const playerOrder = shuffle([0, 1]);
    const remainingTiles = shuffle(assets.tiles);
    const factoryTiles = [];

    for (let i = 0; i < 5; i += 1) {
        factoryTiles.push(remainingTiles.splice(remainingTiles.length - 4, 4));
    }

    return {
        public: {
            game: {
                factoryTiles,
                centerTiles: [5],
                discardedTiles: [],
                hand: [],
                playerOrder,
            },
            players: Array(2).fill({
                score: 0,
                patternLines: [
                    Array(1).fill(null),
                    Array(2).fill(null),
                    Array(3).fill(null),
                    Array(4).fill(null),
                    Array(5).fill(null),
                ],
                wall: Array(5).fill(Array(5).fill(null)),
                floorLine: Array(7).fill(null),
            }),
        },
        private: {
            game: {
                remainingTiles,
            },
        },
        state: states.PICK_UP_TILES.id,
        action: null,
        currentPlayer: players[playerOrder[0]],
    };
};
