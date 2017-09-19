const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 12,

    toString: ({ me, state }) => {
        const [selectedFakirs] = state.action[1];

        if ((selectedFakirs || []).length === 0) {
            return null;
        }

        return `${me.username} spends ${selectedFakirs.length} fakir${selectedFakirs.length !== 1 ? 's' : ''} to improve ${me.gender === 0 ? 'his' : 'her'} action.`;
    },

    isValid: (state, [selectedFakirs]) => {
        if (state.state !== states.SELECT_FAKIRS_FOR_MEEPLE_ACTION.id) {
            return false;
        }

        return state.private.players[state.currentPlayer].resources.some(
            resource => selectedFakirs.includes(resource)
        );
    },

    perform: (state, [selectedFakirs]) => {
        const nextState = clone(state);

        const { resources } = nextState.private.players[nextState.currentPlayer];
        const filteredResources = resources.filter(
            resource => !(selectedFakirs || []).includes(resource)
        );
        const usedFakirCount = resources.length - filteredResources.length;

        nextState.private.players[nextState.currentPlayer].resources = filteredResources;

        nextState.public.game.collectedMeepleCount += usedFakirCount;

        switch (nextState.public.game.collectedMeepleType) {
            case 'Merchant': nextState.state = states.COLLECT_MARKET_RESOURCES.id; break;
            case 'Builder': nextState.state = states.COLLECT_GOLD_COINS.id; break;
            default: nextState.state = states.SELECT_MEEPLE_TO_KILL.id;
        }

        return nextState;
    },
};
