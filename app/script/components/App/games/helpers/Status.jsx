import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import { handleGameActions, updateGameState } from 'actions/games';
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
        if (this.props.historyMode) {
            return '- HISTORY MODE -';
        }

        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

        if (currentPlayer !== this.props.me.id) {
            return `It's ${this.props.users[currentPlayer].username}'s turn.`;
        }

        return this.props.instructions[this.props.gameState.state] || '';
    }

    continueTurn = () => {
        this.props.updateGameState(
            this.props.gameId,
            this.props.confirmableActions[this.props.gameState.state],
            this.props.transformers,
            this.props.globalGameParams
        );
    }

    endTurn = () => {
        this.props.handleGameActions(
            this.props.gameId,
            [
                ...this.props.actions,
                [this.props.endTurnAction, [], this.props.gameState.currentPlayer],
            ]
        );
    }

    mayEndTurn() {
        return this.props.validators[this.props.endTurnAction](this.props.gameState);
    }

    renderLayer() {
        const currentPlayer = this.props.playerOrder[this.props.gameState.currentPlayer];

        ReactDOM.unstable_renderSubtreeIntoContainer(this, (
            <div className="cbf-helper-status">
                <div className="cbf-helper-status__text">
                    {this.getInstruction()}

                    {
                        this.props.confirmableActions &&
                        this.props.confirmableActions[this.props.gameState.state] &&
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
                        disabled
                        onTouchTap={() => null}
                        secondary
                    >
                        Undo
                    </Button>

                    <Button
                        disabled
                        onTouchTap={() => null}
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
    confirmableActions: null,
};

Status.propTypes = {
    actions: PropTypes.array.isRequired,
    confirmableActions: PropTypes.object,
    endTurnAction: PropTypes.number.isRequired,
    handleGameActions: PropTypes.func.isRequired,
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    globalGameParams: PropTypes.array.isRequired,
    historyMode: PropTypes.bool.isRequired,
    instructions: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    transformers: PropTypes.object.isRequired,
    updateGameState: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    validators: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        actions: state.gameStates.actions,
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[state.gameStates.currentState],
        globalGameParams: state.gameStates.globalGameParams,
        historyMode: state.gameStates.currentState !== state.gameStates.states.length - 1,
        me: state.me,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    {
        handleGameActions,
        updateGameState,
    },
    Status
);
