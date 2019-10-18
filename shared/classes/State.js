export default class State {
    static get id() {
        throw new Error('State needs to implement an id getter');
    }

    static get isEndTurnState() {
        return false;
    }

    static instruction() {
        if (this.isEndTurnState) {
            return 'End your turn.';
        }

        if (this.performAutomatically()) {
            return null;
        }

        throw new Error('State needs to implement an instruction method');
    }

    static performAutomatically() {
        return null;
    }
}
