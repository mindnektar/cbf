import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';

class Sidebar extends React.Component {
    render() {
        return (
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
                                key={index}
                            >
                                <div className="cbf-helper-sidebar__history-index">
                                    {index + 1}
                                </div>

                                <div className="cbf-helper-sidebar__history-message">
                                    {this.props.messages[gameState[3][0]](
                                        this.props.users[this.props.playerOrder[gameState[3][2]]],
                                        gameState[3][1]
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
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
