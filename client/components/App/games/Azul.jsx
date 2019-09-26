import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import { actions, states } from 'shared/games/azul';
import Game from './helpers/Game';
import Sidebar from './helpers/Sidebar';
import Status from './helpers/Status';
import Board from './Azul/Board';
import Factory from './Azul/Factory';

const Azul = (props) => {
    const state = props.data.match.states[props.data.match.stateIndex];

    return (
        <Game states={states}>
            <div className="azul">
                <Status
                    endTurnAction={actions.END_TURN}
                    states={states}
                />

                <Sidebar actions={actions} />

                <div className="azul__game">
                    <Board player={state.public.players[props.data.me.id]} />

                    <Factory
                        centerTiles={state.public.game.centerTiles}
                        factoryTiles={state.public.game.factoryTiles}
                    />
                </div>
            </div>
        </Game>
    );
};

Azul.propTypes = {
    data: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Azul));
