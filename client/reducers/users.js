import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer({}, {
    [LOAD]: (state, action) => action.payload.users,
});
