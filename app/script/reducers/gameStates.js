import { CLEAR_GAME_STATES, LOAD_GAME_STATES } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [CLEAR_GAME_STATES]: () => null,
    [LOAD_GAME_STATES]: (state, action) => action.payload.gameStates,
});
