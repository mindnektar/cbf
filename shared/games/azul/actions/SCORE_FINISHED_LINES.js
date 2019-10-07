const clone = require('clone');
const states = require('../states');
const assets = require('../assets');

module.exports = {
    id: 3,
    isServerAction: true,

    toString: ({ me, state, previousState }) => {
        const score = state.players[me.id].score - previousState.players[me.id].score;

        return `${me.name} scores ${score} point${score !== 1 ? 's' : ''}.`;
    },

    isValid: ({ state }) => (
        state.state === states.SCORE_FINISHED_LINES.id
    ),

    perform: ({ state, randomizer }) => {
        const clonedState = clone(state);
        let nextState = clonedState.state;
        const { factoryTiles } = clonedState.game;
        let {
            centerTiles,
            discardedTiles,
            gameEndTriggered,
            nextStartPlayer,
            playerOrder,
            remainingTiles,
        } = clonedState.game;
        let { activePlayers } = clonedState;
        const { patternLines, wall } = clonedState.players[activePlayers[0]];
        let { floorLine, score } = clonedState.players[activePlayers[0]];

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

        if (floorLine.indexOf(5) === 0) {
            centerTiles = floorLine.splice(0, 1);
            [nextStartPlayer] = activePlayers;
        }

        discardedTiles = [...discardedTiles, ...floorLine];
        floorLine = [];

        const nextPlayerIndex = playerOrder.indexOf(activePlayers[0]) + 1;

        if (nextPlayerIndex === playerOrder.length) {
            if (gameEndTriggered) {
                nextState = states.SCORE_BONUSES.id;
                activePlayers = [playerOrder[0]];
            } else {
                const nextStartPlayerIndex = playerOrder.indexOf(nextStartPlayer);

                nextState = states.PICK_UP_TILES.id;
                playerOrder = [
                    ...playerOrder.slice(nextStartPlayerIndex),
                    ...playerOrder.slice(0, nextStartPlayerIndex),
                ];
                activePlayers = [nextStartPlayer];

                for (let i = 0; i < factoryTiles.length; i += 1) {
                    let currentTiles = randomizer.draw(remainingTiles, 4);

                    if (currentTiles.length < 4) {
                        if (discardedTiles.length === 0) {
                            factoryTiles[i] = currentTiles;
                            break;
                        }

                        remainingTiles = discardedTiles;
                        discardedTiles = [];
                        const a = randomizer.draw(remainingTiles, 4 - currentTiles.length);console.log(a);
                        currentTiles = [
                            ...currentTiles,
                            ...a,
                        ];
                    }

                    factoryTiles[i] = currentTiles;
                }
            }
        } else {
            activePlayers = [playerOrder[nextPlayerIndex]];
        }

        return {
            ...clonedState,
            game: {
                ...clonedState.game,
                centerTiles,
                discardedTiles,
                factoryTiles,
                gameEndTriggered,
                nextStartPlayer,
                playerOrder,
                remainingTiles,
            },
            players: {
                ...clonedState.players,
                [clonedState.activePlayers[0]]: {
                    ...clonedState.players[clonedState.activePlayers[0]],
                    floorLine,
                    patternLines,
                    score,
                    wall,
                },
            },
            state: nextState,
            activePlayers,
        };
    },
};
