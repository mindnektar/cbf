import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import LoadingContainer from 'molecules/LoadingContainer';
import Setup from './Game/Setup';
import Lobby from './Game/Lobby';
import Arena from './Game/Arena';

const Game = (props) => {
    const renderContent = () => (
        <Switch>
            <Route path="/play/:gameId/setup" component={Setup} />
            <Route path="/play/:gameId/lobby" component={Lobby} />
            <Route path="/play/:gameId" component={Arena} />
        </Switch>
    );

    return (
        <LoadingContainer>
            {!props.data.loading && renderContent()}
        </LoadingContainer>
    );
};

Game.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default GameModel.graphql(withRouter(Game));
