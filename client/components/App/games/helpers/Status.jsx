import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import {
    redoGameAction,
    switchToLatestGameState,
    undoGameAction,
    updateGameState,
} from 'actions/games';
import Button from 'Button';

class Status extends React.Component {
    getInstruction() {
        if (!this.props.isLatestState) {
            return '- HISTORY MODE -';
        }

        if (this.props.game.scores.length > 0) {
            return `${this.props.users[this.props.game.scores[0].player].username} won the game!`;
        }

        if (this.props.gameState.currentPlayer !== this.props.me.id) {
            return `It's ${this.props.users[this.props.gameState.currentPlayer].username}'s turn.`;
        }

        return this.props.states.findById(this.props.gameState.state).instruction || '';
    }

    continueTurn = () => {
        const { performOnConfirm, params } = this.props.states.findById(this.props.gameState.state);

        this.props.updateGameState(
            this.props.game.id,
            performOnConfirm(),
            params.map(param => this.props.globalGameParams[param.name]),
        );
    }

    endTurn = () => {
        this.props.updateGameState(
            this.props.game.id,
            this.props.endTurnAction,
            this.props.globalGameParams,
        );
    }

    exitHistoryMode = () => {
        this.props.switchToLatestGameState();
    }

    mayContinueTurn() {
        const { performOnConfirm, params } = this.props.states.findById(this.props.gameState.state);

        return (
            this.props.isLatestState &&
            this.props.me.id === this.props.gameState.currentPlayer &&
            params.every(param => this.props.globalGameParams[param.name] !== undefined) &&
            performOnConfirm().isValid(
                this.props.gameState,
                params.map(param => this.props.globalGameParams[param.name])
            )
        );
    }

    mayEndTurn() {
        return (
            this.props.isLatestState &&
            this.props.me.id === this.props.gameState.currentPlayer &&
            this.props.endTurnAction.isValid(this.props.gameState)
        );
    }

    redo = () => {
        this.props.redoGameAction(this.props.states);
    }

    undo = () => {
        this.props.undoGameAction(this.props.states);
    }

    render() {
        return ReactDOM.createPortal(
            <div className="cbf-helper-status">
                <div className="cbf-helper-status__text">
                    {this.getInstruction()}

                    {
                        this.props.states.findById(this.props.gameState.state).performOnConfirm &&
                        <Button
                            disabled={!this.mayContinueTurn()}
                            onClick={this.continueTurn}
                            secondary
                        >
                            Continue
                        </Button>
                    }

                    {!this.props.isLatestState &&
                        <Button
                            onClick={this.exitHistoryMode}
                            secondary
                        >
                            Exit
                        </Button>
                    }
                </div>

                <div className="cbf-helper-status__options">
                    <Button
                        disabled={this.props.actionIndex === 0}
                        onClick={this.undo}
                        secondary
                    >
                        Undo
                    </Button>

                    <Button
                        disabled={this.props.actionIndex === this.props.actions.length}
                        onClick={this.redo}
                        secondary
                    >
                        Redo
                    </Button>

                    <Button
                        disabled={!this.mayEndTurn()}
                        onClick={this.endTurn}
                        secondary
                    >
                        End turn
                    </Button>
                </div>
            </div>,
            document.body
        );
    }
}

Status.propTypes = {
    actionIndex: PropTypes.number.isRequired,
    actions: PropTypes.array.isRequired,
    endTurnAction: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    gameState: PropTypes.object.isRequired,
    globalGameParams: PropTypes.object.isRequired,
    isLatestState: PropTypes.bool.isRequired,
    me: PropTypes.object.isRequired,
    redoGameAction: PropTypes.func.isRequired,
    states: PropTypes.object.isRequired,
    switchToLatestGameState: PropTypes.func.isRequired,
    undoGameAction: PropTypes.func.isRequired,
    updateGameState: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        actionIndex: state.gameStates.actionIndex,
        actions: state.gameStates.actions,
        game: state.games[ownProps.match.params.gameId],
        gameState: state.gameStates.states[state.gameStates.currentState],
        globalGameParams: state.gameStates.globalGameParams,
        isLatestState: state.gameStates.currentState === (
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ),
        me: state.me,
        users: state.users,
    }),
    {
        redoGameAction,
        switchToLatestGameState,
        undoGameAction,
        updateGameState,
    },
    Status
);
