import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';
import {
    actions, assets, messages, states, transformers, validators,
} from 'shared/games/five-tribes';
import Game from './helpers/Game';
import Sidebar from './helpers/Sidebar';
import Player from './helpers/Player';
import Status from './helpers/Status';
import BidOrder from './FiveTribes/BidOrder';
import TurnOrder from './FiveTribes/TurnOrder';
import Board from './FiveTribes/Board';
import Djinns from './FiveTribes/Djinns';
import Market from './FiveTribes/Market';
import Hand from './FiveTribes/Hand';

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
        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

        if (currentPlayer !== this.props.me.id) {
            return `It's ${this.props.users[currentPlayer].username}'s turn.`;
        }

        switch (this.props.gameState.state) {
            case states.BID_FOR_TURN_ORDER:
                return 'Select a spot on the turn order track.';

            case states.SELECT_TILE_FOR_MOVEMENT:
                return 'Select a tile to start your movement.';

            case states.SELECT_TILE_FOR_PLACEMENT:
                return 'Select a neighbouring tile to drop a meeple.';

            case states.SELECT_MEEPLE_TO_PLACE:
                return 'Select a meeple to drop.';

            default:
                return 'End your turn.';
        }
    }

    checkAutomaticActions() {
        if (this.props.gameState.state === states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK) {
            this.props.updateGameState(
                this.props.gameId, actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK, transformers
            );
        }
    }

    render() {
        const playerData = this.props.gameState.public.players;
        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

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
                                    <div>Camels: {playerData[playerIndex].camelCount}</div>
                                    <div>Viziers: {playerData[playerIndex].vizierCount}</div>
                                    <div>Elders: {playerData[playerIndex].elderCount}</div>
                                    <div>Resources: {playerData[playerIndex].resourceCount}</div>
                                    <div>
                                        Djinns: {getDjinnNames(playerData[playerIndex].djinns)}
                                    </div>
                                </div>
                            </Player>
                        )}
                    </Sidebar>

                    <div className="five-tribes__top">
                        <div className="five-tribes__left">
                            <div className="five-tribes__tracks">
                                <BidOrder />

                                <TurnOrder />
                            </div>

                            <Board />
                        </div>

                        <Hand />

                        <Djinns />
                    </div>

                    <Market />
                </div>
            </Game>
        );
    }
}

FiveTribes.propTypes = {
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
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
