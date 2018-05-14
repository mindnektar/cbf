const clone = require('clone');
const states = require('../states');
const { setEndOfTurnState } = require('../helpers');
const assets = require('../assets');

module.exports = {
    id: 19,

    toString: ({ me, state }) => {
        const [selectedDjinn,, selectedFakirs] = state.action[1];

        if (!selectedDjinn) {
            return null;
        }

        const pay = selectedFakirs.length === 1 ? 'an elder and a fakir' : 'two elders';

        return `${me.username} spends ${pay} and takes the djinn ${assets.djinns[selectedDjinn].name}.`;
    },

    isDjinnSelectable: (state, selectedDjinn, djinn) => {
        if (state.state !== states.COLLECT_DJINN.id) {
            return false;
        }

        return (
            state.public.game.availableDjinns.includes(djinn) && (
                selectedDjinn === djinn ||
                selectedDjinn === null
            )
        );
    },

    isElderSelectable: (state, elder) => {
        if (state.state !== states.COLLECT_DJINN.id) {
            return false;
        }

        return state.public.players[state.currentPlayer].elders.includes(elder);
    },

    isFakirSelectable: (state, fakir) => {
        if (state.state !== states.COLLECT_DJINN.id) {
            return false;
        }

        return (
            assets.resources[fakir] === 'Fakir' &&
            state.private.players[state.currentPlayer].resources.includes(fakir)
        );
    },

    isValid: (state, [selectedDjinn, selectedElders, selectedFakirs]) => {
        if (state.state !== states.COLLECT_DJINN.id) {
            return false;
        }

        if (selectedElders.length === 0 && selectedFakirs.length === 0 && !selectedDjinn) {
            return true;
        }

        return (
            (
                (selectedElders.length === 2 && selectedFakirs.length === 0) ||
                (selectedElders.length === 1 && selectedFakirs.length === 1)
            ) &&
            state.public.game.availableDjinns.includes(selectedDjinn) &&
            selectedElders.every(
                elder => state.public.players[state.currentPlayer].elders.includes(elder)
            ) &&
            selectedFakirs.every(fakir => (
                assets.resources[fakir] === 'Fakir' &&
                state.private.players[state.currentPlayer].resources.includes(fakir)
            ))
        );
    },

    perform: (state, [selectedDjinn, selectedElders, selectedFakirs]) => {
        const nextState = clone(state);

        if (selectedDjinn) {
            const djinns = nextState.public.game.availableDjinns.splice(
                nextState.public.game.availableDjinns.indexOf(selectedDjinn), 1
            );

            nextState.public.players[nextState.currentPlayer].djinns = [
                ...nextState.public.players[nextState.currentPlayer].djinns,
                ...djinns,
            ];

            selectedFakirs.forEach((fakir) => {
                nextState.private.players[nextState.currentPlayer].resources.splice(
                    nextState.private.players[nextState.currentPlayer].resources.indexOf(fakir), 1
                );

                nextState.public.players[nextState.currentPlayer].resourceCount -= 1;
            });

            selectedElders.forEach((elder) => {
                nextState.public.players[nextState.currentPlayer].elders.splice(
                    nextState.public.players[nextState.currentPlayer].elders.indexOf(elder), 1
                );
            });
        }

        setEndOfTurnState(nextState);

        return nextState;
    },
};
