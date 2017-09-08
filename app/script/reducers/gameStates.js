import { UPDATE_GAME_STATE } from 'actions/games';
import { CLEAR_GAME_STATES, LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [CLEAR_GAME_STATES]: () => null,
    [LOAD_GAME_STATES]: (state, action) => ({
        states: action.payload.gameStates,
        actions: [],
    }),
    [UPDATE_GAME_STATE]: (state, action) => ({
        actions: [...state.actions, action.payload.nextAction],
        states: [...state.states, action.payload.nextState],
    }),
});
