import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import Setup from './Game/Setup';
import Lobby from './Game/Lobby';
import Arena from './Game/Arena';

const Game = (props) => !props.data.loading && (
    <Switch>
        <Route path="/play/:gameId/setup" component={Setup} />
        <Route path="/play/:gameId/lobby" component={Lobby} />
        <Route path="/play/:gameId" component={Arena} />
    </Switch>
);

Game.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default GameModel.graphql(withRouter(Game));
