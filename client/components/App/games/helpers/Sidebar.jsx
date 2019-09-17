import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { switchGameState } from 'actions/games';

class Sidebar extends React.Component {
    switchGameStateHandler = index => () => {
        this.props.switchGameState(index);
    }

    renderMessage(gameState, index) {
        if (index === 0) {
            return (
                <div
                    className={classNames(
                        'cbf-helper-sidebar__history-item',
                        {
                            'cbf-helper-sidebar__history-item--active': index === this.props.currentState,
                        }
                    )}
                    key={this.messageIndex}
                    onClick={this.switchGameStateHandler(index)}
                >
                    Start of match
                </div>
            );
        }

        if (index > (this.props.stateCountSinceLastLoad - 1) + this.props.actionIndex) {
            return null;
        }

        const [actionId, , currentPlayer] = gameState.action;
        const message = this.props.actions.findById(actionId).toString({
            me: this.props.users[currentPlayer],
            state: gameState,
            previousState: this.props.gameStates[index - 1],
            users: this.props.players.map(userId => this.props.users[userId]),
        });

        if (!message) {
            return null;
        }

        const groupStart = this.actionOwner !== currentPlayer;

        this.messageIndex += 1;
        this.actionOwner = currentPlayer;

        return (
            <div
                className={classNames(
                    'cbf-helper-sidebar__history-item',
                    {
                        'cbf-helper-sidebar__history-item--active': index === this.props.currentState,
                        'cbf-helper-sidebar__history-item--group-start': groupStart,
                    }
                )}
                key={this.messageIndex}
                onClick={this.switchGameStateHandler(index)}
            >
                <div className="cbf-helper-sidebar__history-index">
                    {this.messageIndex}
                </div>

                <div className="cbf-helper-sidebar__history-message">
                    {message}
                </div>
            </div>
        );
    }

    render() {
        this.messageIndex = 0;
        this.actionOwner = null;

        return ReactDOM.createPortal(
            <div
                className="cbf-helper-sidebar"
                onMouseDown={event => event.stopPropagation()}
            >
                <div className="cbf-helper-sidebar__history">
                    <div className="cbf-helper-sidebar__history-header">
                        Turn history
                    </div>

                    <div className="cbf-helper-sidebar__history-scroller">
                        <div className="cbf-helper-sidebar__history-content">
                            {this.props.gameStates.map((gameState, index) => (
                                this.renderMessage(gameState, index)
                            ))}
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );
    }
}

Sidebar.propTypes = {
    actionIndex: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    currentState: PropTypes.number.isRequired,
    gameStates: PropTypes.array.isRequired,
    players: PropTypes.array.isRequired,
    stateCountSinceLastLoad: PropTypes.number.isRequired,
    switchGameState: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        actionIndex: state.gameStates.actionIndex,
        currentState: state.gameStates.currentState,
        gameStates: state.gameStates.states,
        players: state.games[ownProps.match.params.gameId].players,
        stateCountSinceLastLoad: state.gameStates.stateCountSinceLastLoad,
        users: state.users,
    }),
    {
        switchGameState,
    },
    Sidebar
);
