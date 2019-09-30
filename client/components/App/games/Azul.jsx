import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    const players = Object.entries(state.public.players).sort(([a], [b]) => {
        if (props.data.me) {
            if (a === props.data.me.id) {
                return -1;
            }

            if (b === props.data.me.id) {
                return 1;
            }
        }

        return a.localeCompare(b);
    });

    return (
        <Game states={states}>
            <div
                className={classNames(
                    'azul',
                    `azul--num-players-${players.length}`
                )}
            >
                <Status
                    endTurnAction={actions.END_TURN}
                    states={states}
                />

                <Sidebar
                    actions={actions}
                    isGameFinished={props.data.match.status === 'FINISHED'}
                    players={props.data.match.players}
                />

                <div className="azul__game">
                    {players.map(([id, player], index) => (
                        <Board
                            key={id}
                            playerIndex={index}
                            player={player}
                            actionsDisabled={!props.data.me || id !== props.data.me.id}
                        />
                    ))}

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

export default withRouter(GameModel.graphql(React.memo(Azul, (prevProps, nextProps) => (
    prevProps.data.match.stateIndex === nextProps.data.match.stateIndex
))));
