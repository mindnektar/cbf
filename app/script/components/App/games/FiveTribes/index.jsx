import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';
import Sidebar from '../helpers/Sidebar';
import Player from '../helpers/Player';

const playerColors = [
    '#7dcee2',
    '#f1bed7',
];

class FiveTribes extends React.Component {
    render() {
        const gameState = this.props.gameStates[this.props.gameStates.length - 1];
        const board = gameState[0][0][0];
        const resources = gameState[0][0][1];
        const remainingResources = gameState[0][0][2];
        const bidOrder = gameState[0][0][7];
        const playerData = gameState[0][1];

        return (
            <div className="five-tribes">
                <Sidebar>
                    {this.props.playerOrder.map((userId, playerIndex) =>
                        <Player
                            color={playerColors[playerIndex]}
                            key={userId}
                            username={this.props.users[userId].username}
                        >
                            <div className="five-tribes__player-data">
                                <div>Camels: {playerData[playerIndex][0]}</div>
                                <div>Viziers: {playerData[playerIndex][1]}</div>
                                <div>Elders: {playerData[playerIndex][2]}</div>
                                <div>Resources: {playerData[playerIndex][3]}</div>
                            </div>
                        </Player>
                    )}
                </Sidebar>

                <div className="five-tribes__tracks">
                    <div>
                        {[4, 3, 2, 1].map((spot, spotIndex) =>
                            <div key={spot}>
                                <div className="five-tribes__track-number">
                                    {spot}
                                </div>

                                <div
                                    className={classNames(
                                        'five-tribes__track-player',
                                        `five-tribes__track-player-${bidOrder[spotIndex]}`
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <div>0</div>
                        <div>0</div>
                        <div>0</div>
                        <div>1</div>
                        <div>3</div>
                        <div>5</div>
                        <div>8</div>
                        <div>12</div>
                        <div>18</div>
                    </div>
                </div>

                <div className="five-tribes__board">
                    {board.map(row =>
                        <div
                            className="five-tribes__board-row"
                            key={`row${row[0][0]}`}
                        >
                            {row.map(item =>
                                <div
                                    className="five-tribes__tile"
                                    key={item[0]}
                                >
                                    <div
                                        className={classNames(
                                            'five-tribes__tile-value',
                                            `five-tribes__tile-value--${assets.tiles[item[0]].color}`
                                        )}
                                    >
                                        {assets.tiles[item[0]].value}
                                    </div>

                                    <div className="five-tribes__tile-action">
                                        {assets.tiles[item[0]].action}
                                    </div>

                                    <div className="five-tribes__tile-meeples">
                                        {item[1].map(meeple =>
                                            <div
                                                className={classNames(
                                                    'five-tribes__meeple',
                                                    `five-tribes__meeple--${assets.meeples[meeple]}`
                                                )}
                                                key={meeple}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="five-tribes__market">
                    <div className="five-tribes__market-item five-tribes__market-item--deck">
                        <div className="five-tribes__market-item-name">
                            {remainingResources} resource{remainingResources !== 1 ? 's' : ''} remaining
                        </div>
                    </div>

                    {resources.map(resource =>
                        <div
                            className={classNames(
                                'five-tribes__market-item',
                                { 'five-tribes__market-item--fakir': assets.resources[resource] === 'Fakir' }
                            )}
                            key={resource}
                        >
                            <div className="five-tribes__market-item-name">
                                {assets.resources[resource]}
                            </div>

                            <div className="five-tribes__market-item-frequency">
                                {assets.resources.filter(
                                    name => name === assets.resources[resource]
                                ).length}x
                            </div>
                        </div>
                    )}
                </div>

                <div className="five-tribes__djinns">

                </div>
            </div>
        );
    }
}

FiveTribes.propTypes = {
    gameStates: PropTypes.array.isRequired,
    playerOrder: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameStates: state.gameStates,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    null,
    FiveTribes
);
