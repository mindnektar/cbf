const clone = require('clone');
const states = require('../states');
const assets = require('../assets');

module.exports = {
    id: 3,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const score = state.public.players[me.id].score - previousState.public.players[me.id].score;

        return `${me.username} scores ${score} point${score !== 1 ? 's' : ''}.`;
    },

    isValid: state => (
        state.state === states.SCORE_FINISHED_LINES.id
    ),

    perform: (state, payload, players, randomizer) => {
        const clonedState = clone(state);
        let { currentPlayer } = clonedState;
        let nextState = clonedState.state;
        let {
            centerTiles,
            discardedTiles,
            factoryTiles,
            gameEndTriggered,
            nextStartPlayer,
            playerOrder,
        } = clonedState.public.game;
        let {
            patternLines, floorLine, wall, score,
        } = clonedState.public.players[currentPlayer];
        let { remainingTiles } = clonedState.private.game;

        patternLines.forEach((patternLine, index) => {
            if (patternLine.length === index + 1) {
                const tile = patternLines[index].pop();
                const wallIndex = assets.wallLayout[index].indexOf(tile);
                let i = 0;
                let lineScore = 1;
                let columnScore = 1;
                let totalScore = 0;

                wall[index][wallIndex] = tile;
                discardedTiles = [...discardedTiles, ...patternLines[index]];
                patternLines[index] = [];

                for (i = wallIndex - 1; i >= 0 && wall[index][i] !== null; i -= 1) {
                    lineScore += 1;
                }

                for (i = wallIndex + 1; i < 5 && wall[index][i] !== null; i += 1) {
                    lineScore += 1;
                }

                for (i = index - 1; i >= 0 && wall[i][wallIndex] !== null; i -= 1) {
                    columnScore += 1;
                }

                for (i = index + 1; i < 5 && wall[i][wallIndex] !== null; i += 1) {
                    columnScore += 1;
                }

                if (lineScore > 1) {
                    totalScore += lineScore;
                }

                if (columnScore > 1) {
                    totalScore += columnScore;
                }

                if (totalScore === 0) {
                    totalScore = 1;
                }

                score += totalScore;

                if (!wall[index].includes(null)) {
                    gameEndTriggered = true;
                }
            }
        });

        const negatives = floorLine.reduce((result, current, index) => (
            result + assets.floorLineNegatives[index]
        ), 0);

        score = Math.max(0, score - negatives);

        const firstPlayerTokenIndex = floorLine.indexOf(5);

        if (firstPlayerTokenIndex >= 0) {
            centerTiles = floorLine.splice(firstPlayerTokenIndex, 1);
            nextStartPlayer = currentPlayer;
        }

        discardedTiles = [...discardedTiles, ...floorLine];
        floorLine = [];

        const nextPlayerIndex = playerOrder.indexOf(players.indexOf(currentPlayer)) + 1;

        if (nextPlayerIndex === players.length) {
            if (gameEndTriggered) {
                nextState = states.SCORE_BONUSES.id;
                currentPlayer = players[playerOrder[0]];
            } else {
                const nextStartPlayerIndex = playerOrder.indexOf(players.indexOf(nextStartPlayer));

                nextState = states.PICK_UP_TILES.id;
                playerOrder = [
                    ...playerOrder.slice(nextStartPlayerIndex),
                    ...playerOrder.slice(0, nextStartPlayerIndex),
                ];
                currentPlayer = nextStartPlayer;

                for (let i = 0; i < 5; i += 1) {
                    let currentTiles = remainingTiles.splice(0, 4);

                    if (currentTiles.length < 4) {
                        if (discardedTiles.length === 0) {
                            factoryTiles[i] = currentTiles;
                            break;
                        }

                        remainingTiles = randomizer.shuffle(discardedTiles);
                        discardedTiles = [];
                        currentTiles = [
                            ...currentTiles,
                            ...remainingTiles.splice(0, 4 - currentTiles.length),
                        ];
                    }

                    factoryTiles[i] = currentTiles;
                }
            }
        } else {
            currentPlayer = players[playerOrder[nextPlayerIndex]];
        }

        return {
            ...clonedState,
            public: {
                ...clonedState.public,
                game: {
                    ...clonedState.public.game,
                    centerTiles,
                    discardedTiles,
                    factoryTiles,
                    gameEndTriggered,
                    nextStartPlayer,
                    playerOrder,
                },
                players: {
                    ...clonedState.public.players,
                    [clonedState.currentPlayer]: {
                        ...clonedState.public.players[clonedState.currentPlayer],
                        floorLine,
                        patternLines,
                        score,
                        wall,
                    },
                },
            },
            private: {
                ...clonedState.private,
                game: {
                    ...clonedState.private.game,
                    remainingTiles,
                },
            },
            state: nextState,
            currentPlayer,
        };
    },
};
