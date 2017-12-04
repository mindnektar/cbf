import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { actions, states } from 'shared/games/azul';
import Game from './helpers/Game';
import Sidebar from './helpers/Sidebar';
import Status from './helpers/Status';
import Board from './Azul/Board';
import Factory from './Azul/Factory';

class Azul extends React.Component {
    render() {
        const myPlayerData = this.props.gameState.public.players[
            this.props.playerOrder.indexOf(this.props.me.id)
        ];

        return (
            <Game states={states}>
                <div className="azul">
                    <Status
                        endTurnAction={actions.END_TURN}
                        states={states}
                    />

                    <Sidebar actions={actions} />

                    <div className="azul__game">
                        <Board player={myPlayerData} />

                        <Factory
                            centerTiles={this.props.gameState.public.game.centerTiles}
                            factoryTiles={this.props.gameState.public.game.factoryTiles}
                        />
                    </div>
                </div>
            </Game>
        );
    }
}

Azul.propTypes = {
    gameState: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameState: state.gameStates.states[state.gameStates.currentState],
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
    }),
    null,
    Azul
);
