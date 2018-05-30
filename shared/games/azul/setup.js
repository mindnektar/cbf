const assets = require('./assets');
const states = require('./states');

module.exports = (players, randomizer) => {
    const playerOrder = randomizer.shuffle(Object.keys(players));
    const remainingTiles = randomizer.shuffle(assets.tiles);
    const factoryTiles = [];
    const factoryTileCounts = { 2: 5, 3: 7, 4: 9 };

    for (let i = 0; i < factoryTileCounts[players.length]; i += 1) {
        factoryTiles.push(remainingTiles.splice(0, 4));
    }

    return {
        public: {
            game: {
                factoryTiles,
                centerTiles: [5],
                discardedTiles: [],
                hand: [],
                nextStartPlayer: null,
                playerOrder,
            },
            players: playerOrder.reduce((result, current) => ({
                ...result,
                [players[current]]: {
                    score: 0,
                    patternLines: Array(5).fill([]),
                    wall: Array(5).fill(Array(5).fill(null)),
                    floorLine: [],
                },
            }), {}),
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
