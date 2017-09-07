import * as actions from 'actions/games';
import { LOAD, LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer({}, {
    [LOAD]: (state, action) => action.payload.games,
    [LOAD_GAME_STATES]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            ...state[action.payload.id],
            playerOrder: action.payload.playerOrder,
        },
    }),
    [actions.CREATE_GAME]: (state, action) => ({
        ...state,
        [action.payload.id]: action.payload,
    }),
    [actions.CHANGE_GAME_STATUS]: (state, action) => ({
        ...state,
        [action.payload.id]: {
            ...state[action.payload.id],
            status: action.payload.status,
        },
    }),
});
