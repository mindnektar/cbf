const clone = require('clone');
const states = require('../states');
const { setEndOfTurnState } = require('../helpers');

module.exports = {
    id: 18,

    toString: ({ me, state }) => {
        const [selectedResources] = state.action[1];

        if (selectedResources.length === 0) {
            return null;
        }

        const amount = selectedResources.length === 2 ? 'two resources' : 'a resource';

        return `${me.username} spends 6 gold coins and collects ${amount} from the market.`;
    },

    isSelectable: (state, selectedResources, resource) => {
        if (state.state !== states.GO_TO_BIG_MARKET.id) {
            return false;
        }

        return (
            resource < 6 &&
            state.private.players[state.currentPlayer].goldCoinCount >= 6 && (
                selectedResources.includes(resource) ||
                selectedResources.length < 2
            )
        );
    },

    isValid: (state, [selectedResources]) => {
        if (state.state !== states.GO_TO_BIG_MARKET.id) {
            return false;
        }

        if (selectedResources.length === 0) {
            return true;
        }

        if (selectedResources.length === 1) {
            return (
                selectedResources[0] < 6 &&
                state.private.players[state.currentPlayer].goldCoinCount >= 6
            );
        }

        return (
            selectedResources.length === 2 &&
            selectedResources[0] < 6 &&
            selectedResources[1] < 6 &&
            state.private.players[state.currentPlayer].goldCoinCount >= 6
        );
    },

    perform: (state, [selectedResources]) => {
        const nextState = clone(state);

        if (selectedResources.length > 0) {
            for (let i = 0; i < selectedResources.length; i += 1) {
                const resources = nextState.public.game.availableResources.splice(
                    selectedResources[i], 1
                );

                nextState.private.players[nextState.currentPlayer].resources = [
                    ...nextState.private.players[nextState.currentPlayer].resources,
                    ...resources,
                ];

                nextState.public.players[nextState.currentPlayer].resourceCount += 1;
            }

            nextState.private.players[nextState.currentPlayer].goldCoinCount -= 6;
        }

        setEndOfTurnState(nextState);

        return nextState;
    },
};
