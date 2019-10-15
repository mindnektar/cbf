import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PlayerArea from './helpers/PlayerArea';
import Board from './Azul/Board';
import Hand from './Azul/Hand';
import Factory from './Azul/Factory';

const Azul = (props) => {
    const state = props.match.states[props.match.stateIndex];
    const meInSeatingOrder = props.me ? state.seatingOrder.indexOf(props.me.id) : 0;
    const players = [
        ...state.seatingOrder.slice(meInSeatingOrder),
        ...state.seatingOrder.slice(0, meInSeatingOrder),
    ].map((id) => [id, state.players[id]]);

    const renderPlayerArea = ([id, playerData], index) => {
        const { name } = props.match.participants.find(({ player }) => player.id === id).player;

        return (
            <PlayerArea
                name={name}
                index={index}
                playerCount={players.length}
                data={[
                    { label: 'Score', value: playerData.score },
                    { label: 'Rows', value: playerData.wall.filter((line) => !line.includes(null)).length },
                ]}
                key={id}
            >
                <div className="azul__player-area">
                    <Board
                        playerIndex={index}
                        player={playerData}
                        actionsDisabled={!props.me || id !== props.me.id}
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

Azul.defaultProps = {
    me: null,
};

Azul.propTypes = {
    match: PropTypes.object.isRequired,
    me: PropTypes.object,
};

export default Azul;
