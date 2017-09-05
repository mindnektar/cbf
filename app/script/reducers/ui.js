import { LOAD } from 'actions/populate';
import { createReducer } from './_helpers';

export default createReducer({
    isSystemLoaded: false,
}, {
    [LOAD]: (state, action) => ({
        ...state,
        ...action.payload.ui,
    }),
});
