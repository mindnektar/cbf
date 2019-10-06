import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import PlayerArea from './helpers/PlayerArea';
import Board from './Azul/Board';
import Hand from './Azul/Hand';
import Factory from './Azul/Factory';

const Azul = (props) => {
    const state = props.data.match.states[props.data.match.stateIndex];
    const meInSeatingOrder = state.seatingOrder.indexOf(props.data.me.id);
    const players = [
        ...state.seatingOrder.slice(meInSeatingOrder),
        ...state.seatingOrder.slice(0, meInSeatingOrder),
    ].map((id) => [id, state.players[id]]);

    const renderPlayerArea = ([id, playerData], index) => {
        const { name } = props.data.match.players.find((player) => player.id === id);

        return (
            <PlayerArea
                name={name}
                index={index}
                playerCount={players.length}
                data={[
                    { label: 'Score', value: playerData.score },
                ]}
                key={id}
            >
                <div className="azul__player-area">
                    <Board
                        playerIndex={index}
                        player={playerData}
                        actionsDisabled={!props.data.me || id !== props.data.me.id}
                        name={name}
                    />

                    <Hand
                        playerIndex={index}
                        hand={playerData.hand}
                    />
                </div>
            </PlayerArea>
        );
    };

    return (
        <div
            className={classNames(
                'azul',
                `azul--player-count-${players.length}`
            )}
        >
            <div className="azul__game">
                {players.map(renderPlayerArea)}

                <Factory
                    centerTiles={state.game.centerTiles}
                    factoryTiles={state.game.factoryTiles}
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
