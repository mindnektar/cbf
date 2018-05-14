const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 16,
    isServerAction: true,

    toString: ({ me }) => (
        `${me.username} ends ${me.gender === 0 ? 'his' : 'her'} turn.`
    ),

    isValid: state => (
        state.state === states.END_TURN.id
    ),

    perform: (state) => {
        const nextState = clone(state);
        const bidOrder = nextState.public.game.bidOrder.filter(spot => spot !== null);

        // There are still players on the bid order track, so continue bidding
        if (bidOrder.length > 0) {
            nextState.state = states.BID_FOR_TURN_ORDER.id;
            nextState.currentPlayer = bidOrder.pop();
        } else {
            const { turnOrder } = nextState.public.game;
            const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
            const player = occupiedTurnOrderSpots.pop();

            // Turn order track is still occupied, so continue with regular actions
            if (player !== undefined) {
                nextState.state = states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK.id;
                nextState.currentPlayer = player;
            // Let's start a new round!
            } else {
                nextState.public.game.bidOrder = [...nextState.public.game.nextTurnsBidOrder];
                nextState.public.game.nextTurnsBidOrder = Array(4).fill(null);

                for (let i = nextState.public.game.availableResources.length; i < 9; i += 1) {
                    const nextResource = nextState.private.game.remainingResources.pop();

                    nextState.public.game.availableResources.push(nextResource);

                    nextState.public.game.remainingResources -= 1;
                }

                for (let i = nextState.public.game.availableDjinns.length; i < 3; i += 1) {
                    const nextDjinn = nextState.private.game.remainingDjinns.pop();

                    nextState.public.game.availableDjinns.push(nextDjinn);

                    nextState.public.game.remainingDjinns -= 1;
                }

                nextState.state = states.BID_FOR_TURN_ORDER.id;
                nextState.currentPlayer = nextState.public.game.bidOrder[
                    nextState.public.game.bidOrder.length - 1
                ];
            }
        }

        return nextState;
    },
};
