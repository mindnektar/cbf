const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 2,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const [display, type] = state.action[1];
        const pickUpCount = previousState.public.game.factoryTiles[display].filter(
            tile => tile === type
        ).length;
        const tileMap = ['white', 'yellow', 'blue', 'red', 'black'];

        return `${me.username} place his tiles on the .`;
    },

    isValid: (state, [lineIndex]) => {
        if (state.state === states.PICK_UP_TILES.id) {
            return false;
        }

        if (line === null) {
            return true;
        }

        const handTile = state.public.game.hand[0];
        const line = state.public.players[state.currentPlayer].patternLines[lineIndex];

        if (
            line[0] !== null ||
            line[0] !== handTile ||
            line.filter(item => item === null).length === 0
        ) {
            return false;
        }

        return true;
    },

    perform: (state, [lineIndex]) => {
        const nextState = clone(state);

        nextState.public.players[nextState.currentPlayer].patternLines[lineIndex] = [];//////

        nextState.state = states.SELECT_PATTERN_LINE.id;

        return nextState;
    },
};
