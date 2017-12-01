const clone = require('clone');
const states = require('../states');
const { meeples } = require('../assets');
const { canMakeMovementFromTile } = require('../helpers');

module.exports = {
    id: 4,

    toString: ({ me, previousState, state }) => {
        const meeple = previousState.public.game.meeplesInHand.find(
            meepleInHand => !state.public.game.meeplesInHand.includes(meepleInHand)
        );
        let article = 'a';

        if (['Assassin', 'Elder'].includes(meeples[meeple])) {
            article = 'an';
        }

        return `${me.username} drops ${article} ${meeples[meeple].toLowerCase()}.`;
    },

    isValid: (state, [selectedMeeple]) => {
        if (state.state !== states.SELECT_MEEPLE_TO_PLACE.id) {
            return false;
        }

        const { board, dropHistory, meeplesInHand } = state.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];
        const meeplesOnTile = board[rowIndex][itemIndex][1].map(
            meeple => meeples[meeple]
        );
        const meeplesOnHandAfterPlacement = meeplesInHand.filter(
            meeple => meeple !== selectedMeeple
        );

        if (meeplesInHand.length === 1) {
            return meeplesOnTile.includes(meeples[selectedMeeple]);
        }

        return canMakeMovementFromTile(
            state,
            rowIndex,
            itemIndex,
            meeplesOnHandAfterPlacement,
            meeplesOnHandAfterPlacement.length,
            1
        );
    },

    perform: (state, [selectedMeeple]) => {
        const nextState = clone(state);

        const { dropHistory } = state.public.game;
        const rowIndex = dropHistory[dropHistory.length - 1][0];
        const itemIndex = dropHistory[dropHistory.length - 1][1];

        nextState.public.game.meeplesInHand.splice(
            nextState.public.game.meeplesInHand.indexOf(selectedMeeple), 1
        );

        nextState.public.game.board[rowIndex][itemIndex][1].push(selectedMeeple);

        if (nextState.public.game.meeplesInHand.length === 0) {
            nextState.state = states.EXECUTE_MEEPLE_ACTION.id;
        } else {
            nextState.state = states.SELECT_TILE_FOR_PLACEMENT.id;
        }

        return nextState;
    },
};
