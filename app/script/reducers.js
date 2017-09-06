import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import games from 'reducers/games';
import me from 'reducers/me';
import ui from 'reducers/ui';
import users from 'reducers/users';

export default combineReducers({
    games,
    me,
    routing: routerReducer,
    ui,
    users,
});
