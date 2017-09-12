import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import { load, unload } from 'actions/populate';
import Header from './App/Header';
import Home from './App/Home';
import Login from './App/Login';
import Play from './App/Play';

class App extends React.Component {
    componentWillMount() {
        this.props.load();
    }

    componentWillUnmount() {
        this.props.unload();
    }

    render() {
        return (
            <div>
                <Header />

                <div className="cbf-content">
                    {this.props.isSystemLoaded &&
                        <Switch>
                            <Route path="/play" component={Play} />
                            <Route path="/login" component={Login} />
                            <Route path="/" component={Home} />
                        </Switch>
                    }
                </div>
            </div>
        );
    }
}

App.propTypes = {
    isSystemLoaded: PropTypes.bool.isRequired,
    load: PropTypes.func.isRequired,
    unload: PropTypes.func.isRequired,
};

export default connectWithRouter(
    state => ({
        isSystemLoaded: state.ui.isSystemLoaded,
    }),
    {
        load,
        unload,
    },
    App
);
