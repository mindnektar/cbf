const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 1,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const [display, type] = state.action[1];
        const pickUpCount = previousState.public.game.factoryTiles[display].filter(
            tile => tile === type
        ).length;
        const tileMap = ['white', 'yellow', 'blue', 'red', 'black'];

        return `${me.username} picks up ${pickUpCount} ${tileMap[type]} tiles.`;
    },

    isValid: state => (
        state.state === states.PICK_UP_TILES.id
    ),

    perform: (state, [display, type]) => {
        const nextState = clone(state);

        const factoryTiles = nextState.public.game.factoryTiles[display];
        const pickUpCount = factoryTiles.filter(tile => tile === type).length;

        nextState.public.game.factoryTiles[display] = [];
        nextState.public.game.hand = Array(pickUpCount).fill(type);
        nextState.public.game.centerTiles = [
            ...nextState.public.game.centerTiles,
            ...factoryTiles.filter(tile => tile !== type),
        ];

        nextState.state = states.SELECT_PATTERN_LINE.id;

        return nextState;
    },
};
