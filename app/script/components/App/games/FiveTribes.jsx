import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';
import {
    actions, instructions, messages, states, transformers, validators,
} from 'shared/games/five-tribes';
import Game from './helpers/Game';
import Sidebar from './helpers/Sidebar';
import Status from './helpers/Status';
import BidOrder from './FiveTribes/BidOrder';
import TurnOrder from './FiveTribes/TurnOrder';
import Board from './FiveTribes/Board';
import Djinns from './FiveTribes/Djinns';
import Market from './FiveTribes/Market';
import Hand from './FiveTribes/Hand';
import Players from './FiveTribes/Players';

class FiveTribes extends React.Component {
    componentDidMount() {
        this.checkAutomaticActions();
    }

    componentDidUpdate() {
        this.checkAutomaticActions();
    }

    checkAutomaticActions() {
        let action;

        switch (this.props.gameState.state) {
            case states.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK:
                action = actions.MOVE_PLAYER_MARKER_TO_BID_ORDER_TRACK; break;

            case states.EXECUTE_MEEPLE_ACTION:
                action = actions.PICK_UP_MEEPLE; break;

            case states.TAKE_CONTROL_OF_TILE:
                action = actions.TAKE_CONTROL_OF_TILE; break;

            case states.COLLECT_MARKET_RESOURCES:
                action = actions.COLLECT_MARKET_RESOURCES; break;

            case states.COLLECT_GOLD_COINS:
                action = actions.COLLECT_GOLD_COINS; break;

            default:
                action = null;
        }

        if (action) {
            this.props.updateGameState(this.props.gameId, action, transformers);
        }
    }

    render() {
        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

        return (
            <Game awaitsAction={this.props.me.id === currentPlayer}>
                <div className="five-tribes">
                    <Status
                        endTurnAction={actions.END_TURN}
                        mayEndTurn={validators[actions.END_TURN](this.props.gameState)}
                        instructions={instructions}
                    />

                    <Sidebar messages={messages} />

                    <div className="five-tribes__game">
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

                    <Players />
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
