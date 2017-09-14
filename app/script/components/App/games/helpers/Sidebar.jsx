import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';

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

    renderMessage(gameState, index) {
        const message = this.props.messages[gameState.action[0]]({
            me: this.props.users[
                this.props.playerOrder[gameState.action[2]]
            ],
            state: gameState,
            previousState: this.props.gameStates[index - 1],
            users: this.props.playerOrder.map(
                userId => this.props.users[userId]
            ),
            globalGameParams: this.props.globalGameParams,
        });

        if (!message) {
            return null;
        }

        this.messageIndex += 1;

        return (
            <div
                className={classNames(
                    'cbf-helper-sidebar__history-item',
                    { 'cbf-helper-sidebar__history-item--active': index === this.props.gameStates.length - 1 }
                )}
                key={this.messageIndex}
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

        ReactDOM.unstable_renderSubtreeIntoContainer(this, (
            <div
                className="cbf-helper-sidebar"
                onMouseDown={event => event.stopPropagation()}
            >
                <div className="cbf-helper-sidebar__history">
                    <div className="cbf-helper-sidebar__history-header">
                        Turn history
                    </div>

                    <div className="cbf-helper-sidebar__history-content">
                        {this.props.gameStates.map((gameState, index) =>
                            this.renderMessage(gameState, index)
                        )}
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
    gameStates: PropTypes.array.isRequired,
    globalGameParams: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameStates: state.gameStates.states.slice(1),
        globalGameParams: state.gameStates.globalGameParams,
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    null,
    Sidebar
);
