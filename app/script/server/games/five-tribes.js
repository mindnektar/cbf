const shuffle = require('knuth-shuffle').knuthShuffle;
const assets = require('../../shared/games/five-tribes').assets;

const setup = () => {
    const remainingTiles = shuffle(Object.keys(assets.tiles));
    const remainingMeeples = shuffle(Object.keys(assets.meeples));
    const board = [];

    while (remainingTiles.length > 0) {
        const tileRow = remainingTiles.splice(remainingTiles.length - 6, 6);

        board.push([]);

        for (let i = 0; i < 6; i += 1) {
            board[board.length - 1].push([
                // tile
                tileRow[i],
                // meeples
                remainingMeeples.splice(remainingMeeples.length - 3, 3),
                // owner
                null,
                // palm_trees
                0,
                // palaces
                0,
            ]);
        }
    }

    const remainingResources = shuffle(Object.keys(assets.resources));
    const availableResources = remainingResources.splice(remainingResources.length - 9, 9);

    const remainingDjinns = shuffle(Object.keys(assets.djinns));
    const availableDjinns = remainingDjinns.splice(remainingDjinns.length - 3, 3);

    const bidOrder = shuffle([0, 0, 1, 1]);
    const turnOrder = Array(9).fill(null);

    return [
        [
            [
                board,
                availableResources,
                remainingResources.length,
                availableDjinns,
                remainingDjinns.length,
                assets.palm_trees,
                assets.palaces,
                bidOrder,
                turnOrder,
            ],
            [
                [
                    assets.camels,
                ],
                [
                    assets.camels,
                ],
            ],
        ],
        [
            [
                remainingMeeples,
                remainingResources,
                remainingDjinns,
            ],
            [],
        ],
    ];
};

module.exports = {
    setup,
};
