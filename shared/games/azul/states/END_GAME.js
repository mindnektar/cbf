import State from '../../../classes/State';
import actions from '../actions';

export default class extends State {
    static get id() {
        return 4;
    }

    static performAutomatically() {
        return actions.END_GAME;
    }
}
