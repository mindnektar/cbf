import Action from '../../../classes/Action';
import states from '../states';

export default class extends Action {
    static get id() {
        return 4;
    }

    static get isEndGameAction() {
        return true;
    }

    static formatScores(values) {
        return `${values[0]} point${values[0] !== 1 ? 's' : ''}, ${values[1]} row${values[1] !== 1 ? 's' : ''}`;
    }

    static getScores({ state }) {
        return Object.entries(state.players).map(([id, player]) => ({
            id,
            scores: [
                player.score,
                player.wall.filter((line) => !line.includes(null)).length,
            ],
        }));
    }

    static isValid({ state }) {
        return state.state === states.END_GAME.id;
    }
}
