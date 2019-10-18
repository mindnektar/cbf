import State from '../../../classes/State';
import actions from '../actions';

export default class extends State {
    static get id() {
        return 5;
    }

    static performAutomatically() {
        return actions.SCORE_BONUSES;
    }
}
