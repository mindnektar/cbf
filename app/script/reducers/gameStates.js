import { UPDATE_GAME_STATE } from 'actions/games';
import { CLEAR_GAME_STATES, LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [CLEAR_GAME_STATES]: () => null,
    [LOAD_GAME_STATES]: (state, action) => ({
        states: action.payload.gameStates,
        actions: [],
    }),
    [UPDATE_GAME_STATE]: (state, action) => {
        const previousState = state.states[state.states.length - 1];
        const nextAction = [action.payload.action, action.payload.data];
        const nextState = action.payload.transformers[action.payload.action](
            previousState, action.payload.data
        );

        nextState[3] = nextAction;

        return {
            states: [...state.states, nextState],
            actions: [...state.actions, nextAction],
        };
    },
});
