const shuffle = require('knuth-shuffle').knuthShuffle;
const assets = require('../../shared/games/five-tribes').assets;

const setup = () => {
    const remainingTiles = shuffle(Object.keys(assets.tiles));
    const remainingMeeples = shuffle(Object.keys(assets.meeples));
    const board = [];
    const meeples = [];

    while (remainingTiles.length > 0) {
        board.push(remainingTiles.splice(remainingTiles.length - 6, 6));
        meeples.push([]);

        for (let i = 0; i < 6; i += 1) {
            meeples[meeples.length - 1].push(
                remainingMeeples.splice(remainingMeeples.length - 3, 3)
            );
        }
    }

    const remainingResources = shuffle(Object.keys(assets.resources));
    const availableResources = remainingResources.splice(remainingResources.length - 9, 9);

    const remainingDjinns = shuffle(Object.keys(assets.djinns));
    const availableDjinns = remainingDjinns.splice(remainingDjinns.length - 3, 3);

    return [
        [
            [
                board,
                meeples,
                availableResources,
                availableDjinns,
            ],
            [],
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
