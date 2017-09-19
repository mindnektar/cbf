import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import { redoGameAction, undoGameAction, updateGameState } from 'actions/games';
import Button from 'Button';

class Status extends React.Component {
    componentDidMount() {
        this.layerElement = document.createElement('div');
        document.querySelector('[data-reactroot]').appendChild(this.layerElement);
        this.renderLayer();
    }

    componentDidUpdate() {
        this.renderLayer();
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.layerElement);
        document.querySelector('[data-reactroot]').removeChild(this.layerElement);
    }

    getInstruction() {
        if (!this.props.isLatestState) {
            return '- HISTORY MODE -';
        }

        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

        if (currentPlayer !== this.props.me.id) {
            return `It's ${this.props.users[currentPlayer].username}'s turn.`;
        }

        return this.props.states.findById(this.props.gameState.state).instruction || '';
    }

    continueTurn = () => {
        const { performOnConfirm } = this.props.states.findById(this.props.gameState.state);

        this.props.updateGameState(
            this.props.gameId,
            performOnConfirm(),
            this.props.globalGameParams,
        );
    }

    endTurn = () => {
        this.props.updateGameState(
            this.props.gameId,
            this.props.endTurnAction,
            this.props.globalGameParams,
        );
    }

    mayEndTurn() {
        return this.props.endTurnAction.isValid(this.props.gameState);
    }

    redo = () => {
        this.props.redoGameAction(this.props.states);
    }

    undo = () => {
        this.props.undoGameAction(this.props.states);
    }

    renderLayer() {
        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

        ReactDOM.unstable_renderSubtreeIntoContainer(this, (
            <div className="cbf-helper-status">
                <div className="cbf-helper-status__text">
                    {this.getInstruction()}

                    {
                        this.props.states.findById(this.props.gameState.state).performOnConfirm &&
                        <Button
                            onTouchTap={this.continueTurn}
                            secondary
                        >
                            Continue
                        </Button>
                    }
                </div>

                <div className="cbf-helper-status__options">
                    <Button
                        disabled={this.props.actionIndex === 0}
                        onTouchTap={this.undo}
                        secondary
                    >
                        Undo
                    </Button>

                    <Button
                        disabled={this.props.actionIndex === this.props.actions.length}
                        onTouchTap={this.redo}
                        secondary
                    >
                        Redo
                    </Button>

                    <Button
                        disabled={!this.mayEndTurn() || this.props.me.id !== currentPlayer}
                        onTouchTap={this.endTurn}
                        secondary
                    >
                        End turn
                    </Button>
                </div>
            </div>
        ), this.layerElement);
    }

    render() {
        return null;
    }
}

Status.defaultProps = {
    automaticActions: {},
    confirmableActions: {},
    serverActions: [],
};

Status.propTypes = {
    actionIndex: PropTypes.number.isRequired,
    actions: PropTypes.array.isRequired,
    endTurnAction: PropTypes.object.isRequired,
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    globalGameParams: PropTypes.array.isRequired,
    isLatestState: PropTypes.bool.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    redoGameAction: PropTypes.func.isRequired,
    states: PropTypes.object.isRequired,
    undoGameAction: PropTypes.func.isRequired,
    updateGameState: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        actionIndex: state.gameStates.actionIndex,
        actions: state.gameStates.actions,
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ],
        globalGameParams: state.gameStates.globalGameParams,
        isLatestState: state.gameStates.currentState === (
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ),
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    {
        redoGameAction,
        undoGameAction,
        updateGameState,
    },
    Status
);
