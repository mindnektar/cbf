import clone from 'clone';
import { actions, assets, states } from 'shared/games/five-tribes';

export default {
    [actions.SELECT_TURN_ORDER_SPOT]: (state, action) => {
        const nextState = clone(state[state.length - 1]);
        const bidOrder = nextState[0][0][7];
        const turnOrder = nextState[0][0][8];
        const spotIndex = action.payload[0];

        // Remove player marker from bid order track
        const currentPlayer = bidOrder.pop();

        // Put player marker on the selected turn order spot
        turnOrder[spotIndex] = currentPlayer;

        // Subtract the respective amount of money from the player's stash
        nextState[1][1][currentPlayer][0] -= assets.turnOrderTrack[spotIndex];

        // Bidding is over
        if (bidOrder.length === 0) {
            for (let i = turnOrder.length; i >= 0; i -= 1) {
                if (turnOrder[i] === null) {
                    continue;
                }

                // The active player is ahead on the turn order track, let him continue his turn
                if (turnOrder[i] === currentPlayer) {
                    nextState[2] = states.SELECT_TILE_FOR_MOVEMENT;
                // Someone else is ahead on the turn order track
                } else {
                    nextState[2] = states.END_TURN;
                }

                break;
            }
        // Bidding continues with the same player
        } else if (bidOrder[bidOrder.length - 1] === currentPlayer) {
            nextState[2] = states.BID_FOR_TURN_ORDER;
        // Bidding continues with another player
        } else {
            nextState[2] = states.END_TURN;
        }

        nextState[3] = [action.type.split('$')[1], action.payload];

        return [...state, nextState];
    },
};
