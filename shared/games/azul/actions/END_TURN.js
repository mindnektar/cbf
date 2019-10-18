import Action from '../../../classes/Action';
import states from '../states';

export default class extends Action {
    static get id() {
        return 0;
    }

    static get isEndTurnAction() {
        return true;
    }

    static isValid({ state }) {
        return state.state === states.END_TURN.id;
    }

    static perform({ state, player, options }) {
        const { centerTiles, factoryTiles, playerOrder } = state.game;
        let nextState;
        let activePlayers;

        if (factoryTiles.some((display) => display.length > 0) || centerTiles.length > 0) {
            let playerIndex = playerOrder.indexOf(player.id) + 1;

            if (playerIndex === playerOrder.length) {
                playerIndex = 0;
            }

            nextState = states.PICK_UP_TILES.id;
            activePlayers = [playerOrder[playerIndex]];
        } else if (options['game-type'] === 1) {
            nextState = states.MANUALLY_SCORE_FINISHED_LINE.id;
            activePlayers = [...playerOrder];
        } else {
            nextState = states.SCORE_FINISHED_LINES.id;
            activePlayers = [playerOrder[0]];
        }

        return {
            ...state,
            activePlayers,
            state: nextState,
        };
    }
}
