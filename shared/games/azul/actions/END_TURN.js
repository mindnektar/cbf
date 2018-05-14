const clone = require('clone');
const states = require('../states');

module.exports = {
    id: 0,
    isServerAction: true,

    toString: ({ me }) => (
        `${me.username} ends ${me.gender === 0 ? 'his' : 'her'} turn.`
    ),

    isValid: state => (
        state.state === states.END_TURN.id
    ),

    perform: (state) => {
        const nextState = clone(state);

        return nextState;
    },
};
