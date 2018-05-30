import * as actions from 'actions/games';
import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer({}, {
    [LOAD]: (state, action) => action.payload.games || state,
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
