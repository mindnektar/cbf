import clone from 'clone';
import randomizer from '../helpers/randomizer';

export default class Action {
    static get id() {
        throw new Error('Action needs to implement an id getter');
    }

    static get isServerAction() {
        return this.isSetupAction || this.isEndTurnAction || this.isEndGameAction;
    }

    static get isSetupAction() {
        return false;
    }

    static get isEndTurnAction() {
        return false;
    }

    static get isEndGameAction() {
        return false;
    }

    static isValid({ state }) {
        if (this.isSetupAction) {
            return !state;
        }

        throw new Error('Action needs to implement an isValid method');
    }

    static formatScores() {
        if (this.isEndGameAction) {
            throw new Error('Action needs to implement a formatScores method');
        }
    }

    static getScores() {
        if (this.isEndGameAction) {
            throw new Error('Action needs to implement a getScores method');
        }
    }

    static toString({ me }) {
        if (this.isSetupAction) {
            return 'Start of match';
        }

        if (this.isEndTurnAction) {
            return `${me.name} ends their turn.`;
        }

        if (this.isEndGameAction) {
            return 'The game is over.';
        }

        throw new Error('Action needs to implement a toString method');
    }

    static perform() {
        throw new Error('Action needs to implement a perform method');
    }

    static prepareAndPerform(match, action, previousState) {
        return this.perform({
            state: previousState ? clone(previousState) : null,
            payload: action.payload,
            player: action.player,
            allPlayers: match.participants.map((participant) => participant.player),
            randomizer: action.randomSeed ? randomizer(action.randomSeed) : null,
            options: match.options.reduce((result, { type, values }) => ({
                ...result,
                [type]: values,
            }), {}),
        });
    }
}
