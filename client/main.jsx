import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router-dom';
import 'polyfills';
import history from 'browserHistory';
import apolloClient from 'apolloClient';
import App from 'components/App';
import ErrorBoundary from 'components/ErrorBoundary';
import 'style/main.sass';

const render = (AppComponent) => {
    ReactDOM.render(
        <ApolloProvider client={apolloClient}>
            <Router history={history}>
                <ErrorBoundary>
                    <AppComponent />
                </ErrorBoundary>
            </Router>
        </ApolloProvider>,
        document.getElementById('app'),
    );
};

render(App);

if (module.hot) {
    module.hot.accept();
}
