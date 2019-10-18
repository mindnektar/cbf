import State from '../../../classes/State';
import actions from '../actions';

export default class extends State {
    static get id() {
        return 3;
    }

    static performAutomatically() {
        return actions.SCORE_FINISHED_LINES;
    }
}
