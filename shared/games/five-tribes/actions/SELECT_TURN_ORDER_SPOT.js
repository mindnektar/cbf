const clone = require('clone');
const states = require('../states');
const { turnOrderTrack } = require('../assets');

module.exports = {
    id: 0,

    toString: ({ me, state }) => {
        const [spotIndex] = state.action[1];
        const cost = turnOrderTrack[spotIndex];

        if (cost === 0) {
            return `${me.username} pays nothing for ${me.gender === 0 ? 'his' : 'her'} spot on the turn order track.`;
        }

        return `${me.username} pays ${cost} gold coin${cost !== 1 ? 's' : ''} for ${me.gender === 0 ? 'his' : 'her'} spot on the turn order track.`;
    },

    isValid: (state, [spotIndex]) => {
        if (state.state !== states.BID_FOR_TURN_ORDER.id) {
            return false;
        }

        const { currentPlayer } = state;
        const { goldCoinCount } = state.private.players[currentPlayer];
        const { turnOrder } = state.public.game;
        const isSpotFree = turnOrder[spotIndex] === null;
        const isSpotAffordable = goldCoinCount >= turnOrderTrack[spotIndex];

        if (turnOrderTrack[spotIndex] === 0) {
            for (let i = spotIndex - 1; i >= 0; i -= 1) {
                if (turnOrder[i] === null) {
                    return false;
                }
            }
        }

        return isSpotFree && isSpotAffordable;
    },

    perform: (state, [spotIndex]) => {
        const nextState = clone(state);
        const { bidOrder, turnOrder } = nextState.public.game;
        const { currentPlayer } = nextState;

        // Remove player marker from bid order track
        bidOrder[bidOrder.lastIndexOf(currentPlayer)] = null;

        // Put player marker on the selected turn order spot
        turnOrder[spotIndex] = currentPlayer;

        // Subtract the respective amount of money from the player's stash
        nextState.private.players[currentPlayer].goldCoinCount -= turnOrderTrack[spotIndex];

        // Bidding is over
        if (bidOrder.filter(spot => spot !== null).length === 0) {
            for (let i = turnOrder.length - 1; i >= 0; i -= 1) {
                if (turnOrder[i] === null) {
                    continue;
                }

                // The active player is ahead on the turn order track, let him continue his turn
                if (turnOrder[i] === currentPlayer) {
                    nextState.state = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK.id;
                // Someone else is ahead on the turn order track
                } else {
                    nextState.state = states.END_TURN.id;
                }

                break;
            }
        // Bidding continues with the same player
        } else if (bidOrder.filter(spot => spot !== null).pop() === currentPlayer) {
            nextState.state = states.BID_FOR_TURN_ORDER.id;
        // Bidding continues with another player
        } else {
            nextState.state = states.END_TURN.id;
        }

        return nextState;
    },
};
