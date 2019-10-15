import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Helmet from 'react-helmet';
import countMatchesAwaitingAction from 'helpers/countMatchesAwaitingAction';
import AppModel from 'models/app';
import LoadingContainer from 'molecules/LoadingContainer';
import Header from './App/Header';
import Home from './App/Home';
import Play from './App/Play';
import Users from './App/Users';
import Signup from './App/Signup';

const App = (props) => {
    const renderTitle = () => {
        const myMatchCount = countMatchesAwaitingAction(props.data.me);

        if (myMatchCount === 0) {
            return 'Cardboard Frenzy';
        }

        return `(${myMatchCount}) Cardboard Frenzy`;
    };

    const renderContent = () => (
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
                        <Helmet>
                            <title>{renderTitle()}</title>
                        </Helmet>

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

    return (
        <LoadingContainer>
            {!props.data.loading && renderContent()}
        </LoadingContainer>
    );
};

App.propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withRouter(AppModel.graphql(App));
