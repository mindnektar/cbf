const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 1,

    toString: ({ me, state }) => {
        const [, type] = state.action[1];
        const pickUpCount = state.public.game.hand.length;
        const tileMap = ['white', 'yellow', 'blue', 'red', 'black'];

        return `${me.username} picks up ${pickUpCount} ${tileMap[type]} tile${pickUpCount > 1 ? 's' : ''}.`;
    },

    isValid: (state, [display, type]) => {
        if (state.state !== states.PICK_UP_TILES.id) {
            return false;
        }

        if (display === null) {
            return type !== 5 && state.public.game.centerTiles.includes(type);
        }

        return state.public.game.factoryTiles[display].includes(type);
    },

    perform: (state, [display, type]) => {
        const clonedState = clone(state);
        let { centerTiles, factoryTiles } = clonedState.public.game;
        let pickUpCount;
        const { floorLine } = clonedState.public.players[clonedState.currentPlayer];

        if (display === null) {
            pickUpCount = centerTiles.filter(tile => tile === type).length;
            centerTiles = centerTiles.filter(tile => tile !== type);

            if (centerTiles[0] === 5) {
                floorLine.push(centerTiles.shift());
            }
        } else {
            pickUpCount = factoryTiles[display].filter(tile => tile === type).length;
            centerTiles = [
                ...centerTiles,
                ...factoryTiles[display].filter(tile => tile !== type),
            ];
            factoryTiles[display] = [];
        }

        return {
            ...clonedState,
            public: {
                ...clonedState.public,
                game: {
                    ...clonedState.public.game,
                    centerTiles,
                    factoryTiles,
                    hand: Array(pickUpCount).fill(type),
                },
                players: {
                    ...clonedState.public.players,
                    [clonedState.currentPlayer]: {
                        ...clonedState.public.players[clonedState.currentPlayer],
                        floorLine,
                    },
                },
            },
            state: states.SELECT_PATTERN_LINE.id,
        };
    },
};
