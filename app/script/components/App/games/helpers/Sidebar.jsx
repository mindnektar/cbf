import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { switchGameState } from 'actions/games';

class Sidebar extends React.Component {
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
                    onTouchTap={this.switchGameStateHandler(index)}
                >
                    Start of match
                </div>
            );
        }

        const message = this.props.messages[gameState.action[0]]({
            me: this.props.users[
                this.props.playerOrder[gameState.action[2]]
            ],
            state: gameState,
            previousState: this.props.gameStates[index - 1],
            users: this.props.playerOrder.map(
                userId => this.props.users[userId]
            ),
        });

        if (!message) {
            return null;
        }

        const groupStart = this.actionOwner !== gameState.action[2];

        this.messageIndex += 1;
        this.actionOwner = gameState.action[2];

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
                onTouchTap={this.switchGameStateHandler(index)}
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

    renderLayer() {
        this.messageIndex = 0;
        this.actionOwner = null;

        ReactDOM.unstable_renderSubtreeIntoContainer(this, (
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
                            {this.props.gameStates.map((gameState, index) =>
                                this.renderMessage(gameState, index)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ), this.layerElement);
    }

    render() {
        return null;
    }
}

Sidebar.propTypes = {
    currentState: PropTypes.number.isRequired,
    gameStates: PropTypes.array.isRequired,
    messages: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    switchGameState: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        currentState: state.gameStates.currentState,
        gameStates: state.gameStates.states,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    {
        switchGameState,
    },
    Sidebar
);
