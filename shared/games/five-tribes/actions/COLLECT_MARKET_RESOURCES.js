const clone = require('clone');
const states = require('../states');
const { setTileActionState } = require('../helpers');

module.exports = {
    id: 7,

    toString: ({ me, previousState, state }) => {
        const previousPlayerData = previousState.public.players[previousState.currentPlayer];
        const playerData = state.public.players[previousState.currentPlayer];
        const resourceCount = playerData.resourceCount - previousPlayerData.resourceCount;

        if (state.public.game.availableResources.length === 0) {
            return `${me.username} collects all the remaining resources from the market.`;
        }

        return `${me.username} collects the first ${resourceCount} resources from the market.`;
    },

    isValid: state => (
        state.state === states.COLLECT_MARKET_RESOURCES.id
    ),

    perform: (state) => {
        const nextState = clone(state);

        const { collectedMeepleCount } = nextState.public.game;

        const resources = nextState.public.game.availableResources.splice(
            0, collectedMeepleCount
        );

        nextState.public.players[state.currentPlayer].resourceCount += resources.length;

        nextState.private.players[state.currentPlayer].resources = [
            ...nextState.private.players[state.currentPlayer].resources,
            ...resources,
        ];

        setTileActionState(nextState);

        return nextState;
    },
};
