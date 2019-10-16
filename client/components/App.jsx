import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Helmet from 'react-helmet';
import usePrevious from 'hooks/usePrevious';
import countMatchesAwaitingAction from 'helpers/countMatchesAwaitingAction';
import getNextMatchAwaitingAction from 'helpers/getNextMatchAwaitingAction';
import AppModel from 'models/app';
import LoadingContainer from 'molecules/LoadingContainer';
import Header from './App/Header';
import Home from './App/Home';
import Play from './App/Play';
import Users from './App/Users';
import Signup from './App/Signup';

const App = (props) => {
    const myMatchCount = countMatchesAwaitingAction(props.data.me);
    const prevMatchCount = usePrevious(myMatchCount);

    useEffect(() => {
        if (Notification && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    });

    useEffect(() => {
        if (
            myMatchCount > prevMatchCount
            && myMatchCount === 1
            && Notification
            && Notification.permission === 'granted'
        ) {
            const nextMatch = getNextMatchAwaitingAction(props.data.me);
            const notification = new Notification('It\'s your turn!', {
                body: 'Click this notification to go and make your move.',
            });

            notification.onclick = () => {
                props.history.push(`/play/${nextMatch.id}`);
                notification.close();
            };
        }
    }, [myMatchCount]);

    const renderTitle = () => {
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
    history: PropTypes.object.isRequired,
};

export default withRouter(AppModel.graphql(App));
