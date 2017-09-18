import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';

class Game extends React.Component {
    componentDidMount() {
        this.checkAutomaticActions();
    }

    componentDidUpdate() {
        this.checkAutomaticActions();
    }

    checkAutomaticActions() {
        const action = this.props.automaticActions[this.props.gameState.state];

        if (action) {
            this.props.updateGameState(
                this.props.gameId,
                action,
                this.props.transformers
            );
        }
    }

    render() {
        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];
        const awaitsAction = this.props.isLatestState && this.props.me.id === currentPlayer;

        return (
            <div
                className={classNames(
                    'cbf-helper-game',
                    { 'cbf-helper-game--awaits-action': awaitsAction }
                )}
            >
                {this.props.children}
            </div>
        );
    }
}

Game.propTypes = {
    automaticActions: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    isLatestState: PropTypes.bool.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    transformers: PropTypes.object.isRequired,
    updateGameState: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ],
        isLatestState: state.gameStates.currentState === (
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ),
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
    }),
    {
        updateGameState,
    },
    Game
);
