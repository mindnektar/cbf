import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import reducers from 'reducers';

const history = createHistory();

const middleware = [thunk];

if (module.hot) {
    middleware.push(createLogger({
        collapsed: true,
        level: 'info',
        predicate: (getState, action) => typeof action.type !== 'undefined',
    }));
}

middleware.push(routerMiddleware(history));

export default createStore(reducers, applyMiddleware(...middleware));

export const browserHistory = history;
