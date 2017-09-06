const shuffle = require('knuth-shuffle').knuthShuffle;

const assets = {
    meeples: [
        ...Array(18).fill('Vizier'),
        ...Array(18).fill('Elder'),
        ...Array(18).fill('Merchant'),
        ...Array(18).fill('Builder'),
        ...Array(18).fill('Assassin'),
    ],
    tiles: [
        ...Array(4).fill({ color: 'red', value: 4, action: 'big_market' }),
        ...Array(8).fill({ color: 'red', value: 6, action: 'small_market' }),
        ...Array(6).fill({ color: 'red', value: 8, action: 'oasis' }),
        ...Array(5).fill({ color: 'blue', value: 5, action: 'village' }),
        ...Array(4).fill({ color: 'blue', value: 6, action: 'sacred_places' }),
        { color: 'blue', value: 10, action: 'sacred_places' },
        { color: 'blue', value: 12, action: 'sacred_places' },
        { color: 'blue', value: 15, action: 'sacred_places' },
    ],
    resources: [
        ...Array(2).fill('Ivory'),
        ...Array(2).fill('Jewels'),
        ...Array(2).fill('Gold'),
        ...Array(4).fill('Papyrus'),
        ...Array(4).fill('Silk'),
        ...Array(4).fill('Spice'),
        ...Array(6).fill('Fish'),
        ...Array(6).fill('Wheat'),
        ...Array(6).fill('Pottery'),
        ...Array(18).fill('Fakir'),
    ],
    djinns: [
        { name: 'Al-Amin', value: 5, hasAction: false },
        { name: 'Anun-Nak', value: 8, hasAction: true },
        { name: 'Ba\'al', value: 6, hasAction: false },
        { name: 'Boaz', value: 6, hasAction: false },
        { name: 'Bouraq', value: 6, hasAction: true },
        { name: 'Echidna', value: 4, hasAction: true },
        { name: 'Enki', value: 8, hasAction: true },
        { name: 'Hagis', value: 10, hasAction: false },
        { name: 'Haurvatat', value: 8, hasAction: false },
        { name: 'Iblis', value: 8, hasAction: false },
        { name: 'Jafaar', value: 6, hasAction: false },
        { name: 'Kandicha', value: 6, hasAction: false },
        { name: 'Kumarbi', value: 6, hasAction: false },
        { name: 'Lamia', value: 10, hasAction: false },
        { name: 'Leta', value: 4, hasAction: true },
        { name: 'Marid', value: 6, hasAction: false },
        { name: 'Monkir', value: 6, hasAction: false },
        { name: 'Nekir', value: 6, hasAction: false },
        { name: 'Shamhat', value: 6, hasAction: false },
        { name: 'Sibittis', value: 4, hasAction: true },
        { name: 'Sloar', value: 8, hasAction: true },
        { name: 'Utug', value: 4, hasAction: true },
    ],
    palmTrees: 12,
    palaces: 10,
};

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
