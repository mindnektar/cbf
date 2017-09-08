const turnOrderTrack = [0, 0, 0, 1, 3, 5, 8, 12, 18];

module.exports = {
    assets: {
        meeples: [
            ...Array(16).fill('Vizier'),
            ...Array(20).fill('Elder'),
            ...Array(18).fill('Merchant'),
            ...Array(18).fill('Builder'),
            ...Array(18).fill('Assassin'),
        ],
        tiles: [
            ...Array(4).fill({ color: 'red', value: 4, action: 'Big market' }),
            ...Array(8).fill({ color: 'red', value: 6, action: 'Small market' }),
            ...Array(6).fill({ color: 'red', value: 8, action: 'Oasis' }),
            ...Array(5).fill({ color: 'blue', value: 5, action: 'Village' }),
            ...Array(4).fill({ color: 'blue', value: 6, action: 'Sacred place' }),
            { color: 'blue', value: 10, action: 'Sacred place' },
            { color: 'blue', value: 12, action: 'Sacred place' },
            { color: 'blue', value: 15, action: 'Sacred place' },
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
        turnOrderTrack,
    },
    states: {
        BID_FOR_TURN_ORDER: 0,
        SELECT_TILE_FOR_MOVEMENT: 1,
        SELECT_TILE_FOR_PLACEMENT: 2,
        SELECT_MEEPLE_TO_PLACE: 3,
        USE_FAKIRS_TO_IMPROVE_MEEPLE_ACTION: 4,
        SELECT_MEEPLE_TO_KILL: 5,
        GO_TO_MARKET: 6,
        SELECT_RESOURCES_FROM_MARKET: 7,
        COLLECT_DJINN: 8,
        SELECT_DJINN_FROM_DISPLAY: 9,
        SELL_RESOURCES: 10,
        END_TURN: 11,
    },
    actions: {
        SELECT_TURN_ORDER_SPOT: 'FIVE_TRIBES$0',
    },
    validators: {
        maySelectTurnOrderSpot: (state, spotIndex) => {
            const currentPlayer = state[0][0][7][state[0][0][7].length - 1];
            const isSpotFree = state[0][0][8][spotIndex] === null;
            const isSpotAffordable = state[1][1][currentPlayer][0] >= turnOrderTrack[spotIndex];

            if (turnOrderTrack[spotIndex] === 0) {
                for (let i = spotIndex - 1; i >= 0; i -= 1) {
                    if (state[0][0][8][i] === null) {
                        return false;
                    }
                }
            }

            return isSpotFree && isSpotAffordable;
        },
    },
};
