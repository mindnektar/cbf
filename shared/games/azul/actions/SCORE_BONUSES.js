import Action from '../../../classes/Action';
import states from '../states';

export default class extends Action {
    static get id() {
        return 5;
    }

    static get isServerAction() {
        return true;
    }

    static toString({ me, state, previousState }) {
        const score = state.players[me.id].score - previousState.players[me.id].score;

        return `${me.name} scores ${score} bonus point${score !== 1 ? 's' : ''}.`;
    }

    static isValid({ state }) {
        return state.state === states.SCORE_BONUSES.id;
    }

    static perform({ state }) {
        let nextState = state.state;
        let { activePlayers } = state;
        const { playerOrder } = state.game;
        const { wall } = state.players[activePlayers[0]];
        let { score } = state.players[activePlayers[0]];

        score += wall.filter((line) => !line.includes(null)).length * 2;
        score += wall.filter((_, index) => wall.every((line) => line[index] !== null)).length * 7;
        score += wall.filter((_, index) => wall.every((line) => line.includes(index))).length * 10;

        const nextPlayerIndex = playerOrder.indexOf(activePlayers[0]) + 1;

        if (nextPlayerIndex === playerOrder.length) {
            nextState = states.END_GAME.id;
        } else {
            activePlayers = [playerOrder[nextPlayerIndex]];
        }

        return {
            ...state,
            players: {
                ...state.players,
                [state.activePlayers[0]]: {
                    ...state.players[state.activePlayers[0]],
                    score,
                },
            },
            state: nextState,
            activePlayers,
        };
    }
}
