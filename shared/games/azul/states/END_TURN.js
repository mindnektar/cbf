import State from '../../../classes/State';

export default class extends State {
    static get id() {
        return 1;
    }

    static get isEndTurnState() {
        return true;
    }
}
