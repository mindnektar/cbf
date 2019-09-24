import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Header from './App/Header';
import Home from './App/Home';
import Login from './App/Login';
import Play from './App/Play';

const App = (props) => (
    <>
        <Header />

        <div className="cbf-content">
            {props.isSystemLoaded && (
                <Switch>
                    <Route path="/play" component={Play} />
                    <Route path="/login" component={Login} />
                    <Route path="/" component={Home} />
                </Switch>
            )}
        </div>
    </>
);

App.propTypes = {
    isSystemLoaded: PropTypes.bool.isRequired,
    load: PropTypes.func.isRequired,
    unload: PropTypes.func.isRequired,
};

export default App;
