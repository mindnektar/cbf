const clone = require('clone');
const states = require('../states');
const { setTileActionState } = require('../helpers');

module.exports = {
    id: 11,

    toString: ({ me, state, users }) => {
        const [playerIndex] = state.action[1];

        return `${me.username} kills one of ${users[playerIndex].username}'s elders.`;
    },

    isValid: (state, [playerIndex, meepleIndex]) => {
        if (state.state !== states.SELECT_MEEPLE_TO_KILL.id) {
            return false;
        }

        return (
            playerIndex !== state.currentPlayer &&
            state.public.players[playerIndex].elders[meepleIndex] !== undefined
        );
    },

    perform: (state, [playerIndex, meepleIndex]) => {
        const nextState = clone(state);

        const killedMeeple = nextState.public.players[playerIndex].elders.splice(
            meepleIndex, 1
        );

        nextState.private.game.remainingMeeples = [
            ...nextState.private.game.remainingMeeples,
            ...killedMeeple,
        ];

        setTileActionState(nextState);

        return nextState;
    },
};
