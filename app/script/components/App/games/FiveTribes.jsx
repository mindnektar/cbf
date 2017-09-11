import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';
import {
    actions, assets, messages, states, transformers, validators,
} from 'shared/games/five-tribes';
import Game from './helpers/Game';
import Sidebar from './helpers/Sidebar';
import Player from './helpers/Player';
import Status from './helpers/Status';
import Action from './helpers/Action';

const playerColors = [
    '#7dcee2',
    '#f1bed7',
];

const getDjinnNames = (djinns) => {
    if (djinns.length === 0) {
        return 'none';
    }

    return djinns.map(djinnIndex => assets.djinns[djinnIndex].name).split(', ');
};

class FiveTribes extends React.Component {
    componentDidMount() {
        this.checkAutomaticActions();
    }

    componentDidUpdate() {
        this.checkAutomaticActions();
    }

    getStatusMessage() {
        const currentPlayer = this.props.playerOrder[this.props.gameState[4]];

        if (currentPlayer !== this.props.me.id) {
            return `It's ${this.props.users[currentPlayer].username}'s turn.`;
        }

        switch (this.props.gameState[2]) {
            case states.BID_FOR_TURN_ORDER:
                return 'Select a spot on the turn order track.';

            case states.SELECT_TILE_FOR_MOVEMENT:
                return 'Select a tile to start your movement.';

            default:
                return 'End your turn.';
        }
    }

    checkAutomaticActions() {
        if (this.props.gameState[2] === states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK) {
            this.props.updateGameState(
                this.props.gameId, actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK, transformers
            );
        }
    }

    selectTurnOrderSpotHandler = spotIndex => () => {
        this.props.updateGameState(
            this.props.gameId, actions.SELECT_TURN_ORDER_SPOT, transformers, [spotIndex]
        );
    }

    render() {
        const board = this.props.gameState[0][0][0];
        const resources = this.props.gameState[0][0][1];
        const remainingResources = this.props.gameState[0][0][2];
        const djinns = this.props.gameState[0][0][3];
        const remainingDjinns = this.props.gameState[0][0][4];
        const bidOrder = this.props.gameState[0][0][7];
        const turnOrder = this.props.gameState[0][0][8];
        const nextTurnsBidOrder = this.props.gameState[0][0][9];
        const playerData = this.props.gameState[0][1];
        const currentPlayer = this.props.playerOrder[this.props.gameState[4]];

        return (
            <Game awaitsAction={this.props.me.id === currentPlayer}>
                <div className="five-tribes">
                    <Status
                        endTurnAction={actions.END_TURN}
                        mayEndTurn={validators[actions.END_TURN](this.props.gameState)}
                    >
                        {this.getStatusMessage()}
                    </Status>

                    <Sidebar messages={messages}>
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
                                    <div>Djinns: {getDjinnNames(playerData[playerIndex][4])}</div>
                                </div>
                            </Player>
                        )}
                    </Sidebar>

                    <div className="five-tribes__top">
                        <div className="five-tribes__left">
                            <div className="five-tribes__tracks">
                                <div>
                                    {[4, 3, 2, 1].map((spot, spotIndex) =>
                                        <div className="five-tribes__track-item" key={spot}>
                                            <div className="five-tribes__track-number">
                                                {spot}
                                            </div>

                                            {
                                                this.props.gameState[2] === states.BID_FOR_TURN_ORDER ? (
                                                    bidOrder.length > spotIndex &&
                                                    bidOrder[spotIndex] !== null
                                                ) : (
                                                    nextTurnsBidOrder.length > spotIndex &&
                                                    nextTurnsBidOrder[spotIndex] !== null
                                                ) &&
                                                <div
                                                    className={classNames(
                                                        'five-tribes__track-player',
                                                        `five-tribes__track-player-${this.props.gameState[2] === states.BID_FOR_TURN_ORDER ? bidOrder[spotIndex] : nextTurnsBidOrder[spotIndex]}`
                                                    )}
                                                />
                                            }
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {assets.turnOrderTrack.map((spot, spotIndex) =>
                                        <Action
                                            active={
                                                this.props.gameState[2] === states.BID_FOR_TURN_ORDER &&
                                                validators[actions.SELECT_TURN_ORDER_SPOT](this.props.gameState, [spotIndex])
                                            }
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={spotIndex}
                                            onTouchTap={this.selectTurnOrderSpotHandler(spotIndex)}
                                        >
                                            <div className="five-tribes__track-item">
                                                <div className="five-tribes__track-number">
                                                    {spot}
                                                </div>

                                                {turnOrder[spotIndex] !== null &&
                                                    <div
                                                        className={classNames(
                                                            'five-tribes__track-player',
                                                            `five-tribes__track-player-${turnOrder[spotIndex]}`
                                                        )}
                                                    />
                                                }
                                            </div>
                                        </Action>
                                    )}
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
                        </div>

                        <div className="five-tribes__djinns">
                            <div className="five-tribes__djinn-item five-tribes__djinn-item--deck">
                                <div className="five-tribes__djinn-item-name">
                                    {remainingDjinns} djinn{remainingDjinns !== 1 ? 's' : ''} remaining
                                </div>
                            </div>

                            {djinns.map(djinn =>
                                <div
                                    className="five-tribes__djinn-item"
                                    key={djinn}
                                >
                                    <div className="five-tribes__djinn-item-name">
                                        {assets.djinns[djinn].name}
                                    </div>

                                    <div className="five-tribes__djinn-item-value">
                                        {assets.djinns[djinn].value}
                                    </div>
                                </div>
                            )}
                        </div>
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
                </div>
            </Game>
        );
    }
}

FiveTribes.propTypes = {
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.array.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    updateGameState: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    {
        updateGameState,
    },
    FiveTribes
);
