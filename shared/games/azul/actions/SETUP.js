const shuffle = require('knuth-shuffle-seeded');
const assets = require('../assets');
const states = require('../states');

module.exports = {
    id: 6,

    isValid: ({ state }) => (
        !state
    ),

    perform: ({ allPlayers, randomSeed }) => {
        const playerOrder = shuffle(allPlayers.map(({ id }) => id), randomSeed);
        const remainingTiles = shuffle([...assets.tiles], randomSeed);
        const factoryTiles = [];
        const factoryTileCounts = { 2: 5, 3: 7, 4: 9 };

        for (let i = 0; i < factoryTileCounts[playerOrder.length]; i += 1) {
            factoryTiles.push(remainingTiles.splice(0, 4));
        }

        const a = {
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
                    [current]: {
                        score: 0,
                        patternLines: Array.from(Array(5), () => []),
                        wall: Array.from(Array(5), () => Array(5).fill(null)),
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
            activePlayers: [playerOrder[0]],
        };

        return a;
    },
};
