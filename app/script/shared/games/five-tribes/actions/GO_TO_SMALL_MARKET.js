const clone = require('clone');
const states = require('../states');
const { setEndOfTurnState } = require('../helpers');

module.exports = {
    id: 17,

    toString: ({ me, state }) => {
        const [selectedResources] = state.action[1];

        if ((selectedResources || []).length === 0) {
            return null;
        }

        return `${me.username} spends 3 gold coins and collects a resource from the market.`;
    },

    isSelectable: (state, selectedResources, resource) => {
        if (state.state !== states.GO_TO_SMALL_MARKET.id) {
            return false;
        }

        return (
            resource < 3 &&
            state.private.players[state.currentPlayer].goldCoinCount >= 3 && (
                selectedResources.includes(resource) ||
                selectedResources.length < 1
            )
        );
    },

    isValid: (state, [selectedResources]) => {
        if (state.state !== states.GO_TO_SMALL_MARKET.id) {
            return false;
        }

        return (
            selectedResources[0] < 3 &&
            state.private.players[state.currentPlayer].goldCoinCount >= 3
        );
    },

    perform: (state, [selectedResources]) => {
        const nextState = clone(state);

        if (selectedResources && selectedResources.length > 0) {
            const resources = nextState.public.game.availableResources.splice(
                selectedResources[0], 1
            );

            nextState.private.players[nextState.currentPlayer].resources = [
                ...nextState.private.players[nextState.currentPlayer].resources,
                ...resources,
            ];

            nextState.private.players[nextState.currentPlayer].goldCoinCount -= 3;

            nextState.public.players[nextState.currentPlayer].resourceCount += 1;
        }

        setEndOfTurnState(nextState);

        return nextState;
    },
};
