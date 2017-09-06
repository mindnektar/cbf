import { LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [LOAD_GAME_STATES]: (state, action) => action.payload.gameStates,
});
