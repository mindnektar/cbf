import React from 'react';
import { Switch, Route } from 'react-router-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import Setup from './Game/Setup';
import Lobby from './Game/Lobby';
import Arena from './Game/Arena';

class Game extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/play/:gameId/setup" component={Setup} />
                <Route path="/play/:gameId/lobby" component={Lobby} />
                <Route path="/play/:gameId" component={Arena} />
            </Switch>
        );
    }
}

export default connectWithRouter(
    null,
    null,
    Game
);
