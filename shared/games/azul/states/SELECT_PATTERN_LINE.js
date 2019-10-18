import State from '../../../classes/State';

export default class extends State {
    static get id() {
        return 2;
    }

    static instruction() {
        return 'Select the pattern line on which to place your tiles.';
    }
}
