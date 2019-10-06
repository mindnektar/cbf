import React, { useContext } from 'react';
import classNames from 'classnames';
import MatchContext from 'contexts/MatchContext';
import PlayerArea from './helpers/PlayerArea';
import Board from './Azul/Board';
import Hand from './Azul/Hand';
import Factory from './Azul/Factory';

const Azul = () => {
    const { match, me } = useContext(MatchContext);
    const state = match.states[match.stateIndex];
    const meInSeatingOrder = state.seatingOrder.indexOf(me.id);
    const players = [
        ...state.seatingOrder.slice(meInSeatingOrder),
        ...state.seatingOrder.slice(0, meInSeatingOrder),
    ].map((id) => [id, state.players[id]]);

    const renderPlayerArea = ([id, playerData], index) => {
        const { name } = match.players.find((player) => player.id === id);

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
                        actionsDisabled={!me || id !== me.id}
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

export default Azul;
