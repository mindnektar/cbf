import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer({
    me: null,
}, {
    [LOAD]: (state, action) => action.payload.me,
});
