const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 2,

    toString: ({ me, state }) => {
        const [lineIndex] = state.action[1];
        const numberMap = ['first', 'second', 'third', 'fourth', 'fifth'];
        const lineText = lineIndex === null ? 'floor line' : `${numberMap[lineIndex]} pattern line`;

        return `${me.username} places their tiles on their ${lineText}.`;
    },

    isValid: (state, [lineIndex]) => {
        const { hand } = state.public.game;
        const { patternLines, wall } = state.public.players[state.currentPlayer];

        if (state.state !== states.SELECT_PATTERN_LINE.id) {
            return false;
        }

        if (lineIndex === null) {
            return true;
        }

        const line = patternLines[lineIndex];

        return (
            line.length < lineIndex + 1 &&
            (!line[0] || line[0] === hand[0]) &&
            !wall[lineIndex].includes(hand[0])
        );
    },

    perform: (state, [lineIndex]) => {
        const clonedState = clone(state);
        const { hand, discardedTiles } = clonedState.public.game;
        const { patternLines, floorLine } = clonedState.public.players[clonedState.currentPlayer];

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
            public: {
                ...clonedState.public,
                game: {
                    ...clonedState.public.game,
                    discardedTiles,
                    hand,
                },
                players: {
                    ...clonedState.public.players,
                    [clonedState.currentPlayer]: {
                        ...clonedState.public.players[clonedState.currentPlayer],
                        floorLine,
                        patternLines,
                    },
                },
            },
            state: states.END_TURN.id,
        };
    },
};
