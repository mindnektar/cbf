import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import Setup from './Game/Setup';
import Lobby from './Game/Lobby';
import Arena from './Game/Arena';

class Game extends React.Component {
    componentWillMount() {
        if (!this.props.gameExists) {
            this.props.replace('play');
        }
    }

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

Game.propTypes = {
    gameExists: PropTypes.bool.isRequired,
    replace: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameExists: !!state.games[ownProps.match.params.gameId],
    }),
    {
        replace,
    },
    Game
);
