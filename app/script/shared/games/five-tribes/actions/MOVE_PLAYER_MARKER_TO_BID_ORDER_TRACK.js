const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 1,

    toString: ({ me }) => (
        `${me.username} moves ${me.gender === 0 ? 'his' : 'her'} player marker to the bid order track.`
    ),

    isValid: state => (
        state.state === states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK.id
    ),

    perform: (state) => {
        const nextState = clone(state);
        const { nextTurnsBidOrder, turnOrder } = nextState.public.game;
        const occupiedTurnOrderSpots = turnOrder.filter(spot => spot !== null);
        const player = occupiedTurnOrderSpots.pop();

        nextTurnsBidOrder[nextTurnsBidOrder.lastIndexOf(null)] = player;
        turnOrder[turnOrder.lastIndexOf(player)] = null;

        nextState.state = states.SELECT_TILE_FOR_MOVEMENT.id;

        return nextState;
    },
};
