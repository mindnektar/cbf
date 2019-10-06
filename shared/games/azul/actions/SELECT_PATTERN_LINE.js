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
        const { discardedTiles } = state.game;
        const patternLines = state.players[player.id].patternLines.map((line) => [...line]);
        const floorLine = [...state.players[player.id].floorLine];
        const hand = [...state.players[player.id].hand];

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
            ...state,
            game: {
                ...state.game,
                discardedTiles,
            },
            players: {
                ...state.players,
                [player.id]: {
                    ...state.players[player.id],
                    floorLine,
                    patternLines,
                    hand,
                },
            },
            state: states.END_TURN.id,
        };
    },
};
