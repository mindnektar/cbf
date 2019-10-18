import State from '../../../classes/State';

export default class extends State {
    static get id() {
        return 0;
    }

    static instruction(state) {
        const { centerTiles } = state.game;
        const center = centerTiles.length >= 2 || ![5, undefined].includes(centerTiles[0])
            ? ' or the center of the table'
            : '';

        return `Select tiles from a factory display${center}.`;
    }
}
