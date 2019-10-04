import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header from './App/Header';
import Home from './App/Home';
import Play from './App/Play';
import Users from './App/Users';
import Signup from './App/Signup';

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
                        <Route path="/users" component={Users} />
                        <Route path="/signup" component={Signup} />
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
