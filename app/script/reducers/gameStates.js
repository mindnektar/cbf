import {
    CHANGE_ACTION_INDEX,
    SWITCH_GAME_STATE,
    UPDATE_GAME_STATE,
    UPDATE_GLOBAL_GAME_PARAMS,
} from 'actions/games';
import { CLEAR_GAME_STATES, LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [CLEAR_GAME_STATES]: () => null,
    [LOAD_GAME_STATES]: (state, action) => ({
        actionIndex: 0,
        actions: [],
        currentState: action.payload.gameStates.length - 1,
        globalGameParams: [],
        stateCountSinceLastLoad: action.payload.gameStates.length,
        states: action.payload.gameStates,
    }),
    [CHANGE_ACTION_INDEX]: (state, action) => ({
        ...state,
        actionIndex: action.payload.actionIndex,
        currentState: (state.stateCountSinceLastLoad - 1) + action.payload.actionIndex,
    }),
    [SWITCH_GAME_STATE]: (state, action) => ({
        ...state,
        currentState: action.payload.currentState,
    }),
    [UPDATE_GAME_STATE]: (state, action) => ({
        ...state,
        actionIndex: state.actionIndex + 1,
        actions: [
            ...state.actions.slice(0, state.actionIndex),
            action.payload.nextAction,
        ],
        currentState: state.currentState + 1,
        states: [
            ...state.states.slice(0, state.stateCountSinceLastLoad + state.actionIndex),
            action.payload.nextState,
        ],
    }),
    [UPDATE_GLOBAL_GAME_PARAMS]: (state, action) => ({
        ...state,
        globalGameParams: action.payload,
    }),
});
