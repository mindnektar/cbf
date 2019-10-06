const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 2,

    toString: ({ me, payload: [lineIndex] }) => {
        const numberMap = ['first', 'second', 'third', 'fourth', 'fifth'];
        const lineText = lineIndex === null ? 'floor line' : `${numberMap[lineIndex]} pattern line`;

        return `${me.name} places their tiles on their ${lineText}.`;
    },

    isValid: ({ state, player, payload: [lineIndex] }) => {
        const { patternLines, wall, hand } = state.players[player.id];

        if (state.state !== states.SELECT_PATTERN_LINE.id) {
            return false;
        }

        if (lineIndex === null) {
            return true;
        }

        const line = patternLines[lineIndex];

        return (
            line.length < lineIndex + 1
            && (typeof line[0] === 'undefined' || line[0] === hand[0])
            && !wall[lineIndex].includes(hand[0])
        );
    },

    perform: ({ state, player, payload: [lineIndex] }) => {
        const clonedState = clone(state);
        const { discardedTiles } = clonedState.game;
        const { patternLines, floorLine, hand } = clonedState.players[player.id];

        if (lineIndex !== null) {
            while (hand.length > 0 && patternLines[lineIndex].length < lineIndex + 1) {
                patternLines[lineIndex].push(hand.pop());
            }
        }

        while (hand.length > 0 && floorLine.length < 7) {
            floorLine.push(hand.pop());
        }

        while (hand.length > 0) {
            discardedTiles.push(hand.pop());
        }

        return {
            ...clonedState,
            game: {
                ...clonedState.game,
                discardedTiles,
            },
            players: {
                ...clonedState.players,
                [player.id]: {
                    ...clonedState.players[player.id],
                    floorLine,
                    patternLines,
                    hand,
                },
            },
            state: states.END_TURN.id,
        };
    },
};
