const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 1,

    toString: ({ me, state, payload: [, type] }) => {
        const pickUpCount = state.players[me.id].hand.length;
        const tileMap = ['light blue', 'yellow', 'blue', 'red', 'black'];

        return `${me.name} picks up ${pickUpCount} ${tileMap[type]} tile${pickUpCount > 1 ? 's' : ''}.`;
    },

    isValid: ({ state, payload: [display, type] }) => {
        if (state.state !== states.PICK_UP_TILES.id) {
            return false;
        }

        if (display === null) {
            return type !== 5 && state.game.centerTiles.includes(type);
        }

        return state.game.factoryTiles[display].includes(type);
    },

    perform: ({ state, player, payload: [display, type] }) => {
        const clonedState = clone(state);
        let { centerTiles } = clonedState.game;
        const { factoryTiles } = clonedState.game;
        let pickUpCount;
        const { floorLine } = clonedState.players[player.id];

        if (display === null) {
            pickUpCount = centerTiles.filter((tile) => tile === type).length;
            centerTiles = centerTiles.filter((tile) => tile !== type);

            if (centerTiles[0] === 5) {
                floorLine.push(centerTiles.shift());
            }
        } else {
            pickUpCount = factoryTiles[display].filter((tile) => tile === type).length;
            centerTiles = [
                ...centerTiles,
                ...factoryTiles[display].filter((tile) => tile !== type),
            ];
            factoryTiles[display] = [];
        }

        return {
            ...clonedState,
            game: {
                ...clonedState.game,
                centerTiles,
                factoryTiles,
            },
            players: {
                ...clonedState.players,
                [player.id]: {
                    ...clonedState.players[player.id],
                    floorLine,
                    hand: Array(pickUpCount).fill(type),
                },
            },
            state: states.SELECT_PATTERN_LINE.id,
        };
    },
};
