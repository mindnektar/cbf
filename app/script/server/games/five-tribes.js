const shuffle = require('knuth-shuffle').knuthShuffle;
const game = require('../../shared/games/five-tribes');

const setup = () => {
    const remainingTiles = shuffle(Object.keys(game.assets.tiles));
    const remainingMeeples = shuffle(Object.keys(game.assets.meeples));
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

    const remainingResources = shuffle(Object.keys(game.assets.resources));
    const availableResources = remainingResources.splice(remainingResources.length - 9, 9);

    const remainingDjinns = shuffle(Object.keys(game.assets.djinns));
    const availableDjinns = remainingDjinns.splice(remainingDjinns.length - 3, 3);

    const bidOrder = shuffle([0, 0, 1, 1]);
    const turnOrder = Array(9).fill(null);
    const nextTurnsBidOrder = Array(4).fill(null);

    return [
        // public data
        [
            // game state
            [
                // board layout
                board,
                // resources in the market
                availableResources,
                // number of remaining resources
                remainingResources.length,
                // djinns up for grabs
                availableDjinns,
                // number of remaining djinns
                remainingDjinns.length,
                // number of remaining palm trees
                game.assets.palm_trees,
                // number of remaining palaces
                game.assets.palaces,
                // player order for bidding
                bidOrder,
                // player order for turns
                turnOrder,
                // next turn's bid order
                nextTurnsBidOrder,
                // meeples in hand
                [],
                // history of meeple drops,
                [],
            ],
            // player states
            Array(2).fill([
                // camels
                11,
                // viziers
                0,
                // elders
                0,
                // number of resources
                0,
                // djinns
                [],
            ]),
        ],
        // private data
        [
            // game state
            [
                // meeples in the bag
                remainingMeeples,
                // resource draw stack
                remainingResources,
                // djinn draw stack
                remainingDjinns,
            ],
            // player states
            Array(2).fill([
                // money
                50,
                // resources
                [],
            ]),
        ],
        // action state
        game.states.BID_FOR_TURN_ORDER,
        // last action
        null,
        // current player
        bidOrder[bidOrder.length - 1],
    ];
};

module.exports = {
    setup,
};
