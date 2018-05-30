import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer(null, {
    [LOAD]: (state, action) => action.payload.me || state,
});
