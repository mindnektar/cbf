import { UPDATE_GAME_STATE, UPDATE_GLOBAL_GAME_PARAMS } from 'actions/games';
import { CLEAR_GAME_STATES, LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [CLEAR_GAME_STATES]: () => null,
    [LOAD_GAME_STATES]: (state, action) => ({
        states: action.payload.gameStates,
        actions: [],
        globalGameParams: [],
    }),
    [UPDATE_GAME_STATE]: (state, action) => ({
        ...state,
        actions: [...state.actions, action.payload.nextAction],
        states: [...state.states, action.payload.nextState],
    }),
    [UPDATE_GLOBAL_GAME_PARAMS]: (state, action) => ({
        ...state,
        globalGameParams: action.payload,
    }),
});
