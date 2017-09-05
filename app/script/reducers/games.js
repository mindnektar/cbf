import * as actions from 'actions/games';
import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer({
    games: {},
}, {
    [LOAD]: (state, action) => action.payload.games,
    [actions.CREATE_GAME]: (state, action) => ({
        ...state,
        [action.payload.id]: action.payload,
    }),
});
