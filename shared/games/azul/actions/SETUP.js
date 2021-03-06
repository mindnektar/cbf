const assets = require('../assets');
const states = require('../states');

module.exports = {
    id: 6,

    isValid: ({ state }) => (
        !state
    ),

    perform: ({ allPlayers, randomizer }) => {
        const seatingOrder = randomizer.shuffle(allPlayers.map(({ id }) => id));
        const remainingTiles = [...assets.tiles];
        const factoryTiles = [];
        const factoryTileCounts = { 2: 5, 3: 7, 4: 9 };

        for (let i = 0; i < factoryTileCounts[allPlayers.length]; i += 1) {
            factoryTiles.push(randomizer.draw(remainingTiles, 4));
        }

        return {
            game: {
                remainingTiles,
                factoryTiles,
                centerTiles: [5],
                discardedTiles: [],
                nextStartPlayer: null,
                playerOrder: [...seatingOrder],
            },
            players: seatingOrder.reduce((result, current) => ({
                ...result,
                [current]: {
                    score: 0,
                    patternLines: Array.from(Array(5), () => []),
                    wall: Array.from(Array(5), () => Array(5).fill(null)),
                    floorLine: [],
                    hand: [],
                },
            }), {}),
            state: states.PICK_UP_TILES.id,
            seatingOrder,
            activePlayers: [seatingOrder[0]],
        };
    },
};
