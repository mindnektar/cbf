import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'polyfills';
import store, { browserHistory } from 'store';
import App from './components/App';
import '../style/main.sass';

injectTapEventPlugin();

const render = (AppComponent) => {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={browserHistory}>
                <AppComponent />
            </Router>
        </Provider>,
        document.getElementById('app'),
    );
};

render(App);

if (module.hot) {
    module.hot.accept(['./components/App'], () => {
        // eslint-disable-next-line global-require
        const AppComponent = require('./components/App').default;

        render(AppComponent);
    });

    module.hot.accept('./reducers', () => {
        // eslint-disable-next-line global-require
        store.replaceReducer(require('./reducers').default);
    });
}
