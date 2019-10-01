import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header from './App/Header';
import Home from './App/Home';
import Login from './App/Login';
import Play from './App/Play';

const App = (props) => (
    <>
        <Header />

        <TransitionGroup component={React.Fragment}>
            <CSSTransition
                classNames="cbf-content-"
                mountOnEnter
                timeout={300}
                unmountOnExit
                key={props.location.pathname}
            >
                <div className="cbf-content">
                    <Switch location={props.location}>
                        <Route path="/play" component={Play} />
                        <Route path="/login" component={Login} />
                        <Route path="/" component={Home} />
                    </Switch>
                </div>
            </CSSTransition>
        </TransitionGroup>
    </>
);

App.propTypes = {
    location: PropTypes.object.isRequired,
};

export default withRouter(App);
