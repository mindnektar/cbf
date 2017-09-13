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

    renderLayer() {
        ReactDOM.unstable_renderSubtreeIntoContainer(this, (
            <div
                className="cbf-helper-sidebar"
                onMouseDown={event => event.stopPropagation()}
            >
                <div className="cbf-helper-sidebar__players">
                    {this.props.children}
                </div>

                <div className="cbf-helper-sidebar__history">
                    <div className="cbf-helper-sidebar__history-header">
                        Turn history
                    </div>

                    <div className="cbf-helper-sidebar__history-content">
                        {this.props.gameStates.map((gameState, index) =>
                            <div
                                className={classNames(
                                    'cbf-helper-sidebar__history-item',
                                    { 'cbf-helper-sidebar__history-item--active': index === this.props.gameStates.length - 1 }
                                )}
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                            >
                                <div className="cbf-helper-sidebar__history-index">
                                    {index + 1}
                                </div>

                                <div className="cbf-helper-sidebar__history-message">
                                    {this.props.messages[gameState.action[0]](
                                        this.props.users[
                                            this.props.playerOrder[gameState.action[2]]
                                        ],
                                        gameState,
                                        this.props.gameStates[index - 1],
                                        this.props.playerOrder.map(
                                            userId => this.props.users[userId]
                                        )
                                    )}
                                </div>
                            </div>
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
    children: PropTypes.node.isRequired,
    gameStates: PropTypes.array.isRequired,
    messages: PropTypes.object.isRequired,
    playerOrder: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameStates: state.gameStates.states.slice(1),
        playerOrder: state.games[ownProps.match.params.gameId].playerOrder,
        users: state.users,
    }),
    null,
    Sidebar
);
