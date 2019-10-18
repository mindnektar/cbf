import Action from '../../../classes/Action';
import states from '../states';
import assets from '../assets';

export default class extends Action {
    static get id() {
        return 3;
    }

    static get isServerAction() {
        return true;
    }

    static toString({ me, state, previousState }) {
        const score = state.players[me.id].score - previousState.players[me.id].score;

        return `${me.name} scores ${score} point${score !== 1 ? 's' : ''}.`;
    }

    static isValid({ state }) {
        return state.state === states.SCORE_FINISHED_LINES.id;
    }

    static perform({ state, randomizer }) {
        let nextState = state.state;
        const { factoryTiles } = state.game;
        let {
            centerTiles,
            discardedTiles,
            gameEndTriggered,
            nextStartPlayer,
            playerOrder,
            remainingTiles,
        } = state.game;
        let { activePlayers } = state;
        const { patternLines, wall } = state.players[activePlayers[0]];
        let { floorLine, score } = state.players[activePlayers[0]];

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

        const firstPlayerTileIndex = floorLine.indexOf(5);

        if (firstPlayerTileIndex >= 0) {
            centerTiles = floorLine.splice(firstPlayerTileIndex, 1);
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
                        currentTiles = [
                            ...currentTiles,
                            ...randomizer.draw(remainingTiles, 4 - currentTiles.length),
                        ];
                    }

                    factoryTiles[i] = currentTiles;
                }
            }
        } else {
            activePlayers = [playerOrder[nextPlayerIndex]];
        }

        return {
            ...state,
            game: {
                ...state.game,
                centerTiles,
                discardedTiles,
                factoryTiles,
                gameEndTriggered,
                nextStartPlayer,
                playerOrder,
                remainingTiles,
            },
            players: {
                ...state.players,
                [state.activePlayers[0]]: {
                    ...state.players[state.activePlayers[0]],
                    floorLine,
                    patternLines,
                    score,
                    wall,
                },
            },
            state: nextState,
            activePlayers,
        };
    }
}
