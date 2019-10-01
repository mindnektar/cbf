import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
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
        <div
            className={classNames(
                'azul',
                `azul--num-players-${players.length}`
            )}
        >
            <div className="azul__game">
                {players.map(([id, playerData], index) => (
                    <Board
                        key={id}
                        playerIndex={index}
                        player={playerData}
                        actionsDisabled={!props.data.me || id !== props.data.me.id}
                        name={props.data.match.players.find((player) => player.id === id).name}
                    />
                ))}

                <Factory
                    centerTiles={state.public.game.centerTiles}
                    factoryTiles={state.public.game.factoryTiles}
                />
            </div>
        </div>
    );
};

Azul.propTypes = {
    data: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(React.memo(Azul, (prevProps, nextProps) => (
    prevProps.data.match.stateIndex === nextProps.data.match.stateIndex
))));
