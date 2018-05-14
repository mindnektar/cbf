import * as actions from 'actions/me';
import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [LOAD]: (state, action) => action.payload.me,
    [actions.JOIN_GAME]: (state, action) => ({
        ...state,
        games: {
            ...state.games,
            [action.payload.id]: {
                id: action.payload.id,
                admin: action.payload.admin,
            },
        },
    }),
});
