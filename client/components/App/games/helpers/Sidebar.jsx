import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';

const Sidebar = (props) => {
    const switchGameStateHandler = (index) => () => {
        props.switchGameState(index);
    };

    const renderMessage = (gameState, index) => {
        if (index === 0) {
            return (
                <div
                    className={classNames(
                        'cbf-helper-sidebar__history-item',
                        {
                            'cbf-helper-sidebar__history-item--active': index === props.data.match.stateIndex,
                        }
                    )}
                    key={messageIndex}
                    onClick={switchGameStateHandler(index)}
                >
                    Start of match
                </div>
            );
        }

        // if (index > (props.stateCountSinceLastLoad - 1) + props.actionIndex) {
        //     return null;
        // }

        const { player, type } = props.data.match.actions[index];
        const message = props.actions.findById(type).toString({
            me: player,
            state: gameState,
            previousState: props.data.match.states[index - 1],
            players: props.data.match.players,
        });

        if (!message) {
            return null;
        }

        const groupStart = actionOwner !== player.id;

        messageIndex += 1;
        actionOwner = player.id;

        return (
            <div
                className={classNames(
                    'cbf-helper-sidebar__history-item',
                    {
                        'cbf-helper-sidebar__history-item--active': index === props.data.match.stateIndex,
                        'cbf-helper-sidebar__history-item--group-start': groupStart,
                    }
                )}
                key={messageIndex}
                onClick={switchGameStateHandler(index)}
            >
                <div className="cbf-helper-sidebar__history-index">
                    {messageIndex}
                </div>

                <div className="cbf-helper-sidebar__history-message">
                    {message}
                </div>
            </div>
        );
    };

    let messageIndex = 0;
    let actionOwner = null;

    return ReactDOM.createPortal(
        <div
            className="cbf-helper-sidebar"
            onMouseDown={(event) => event.stopPropagation()}
        >
            <div className="cbf-helper-sidebar__history">
                <div className="cbf-helper-sidebar__history-header">
                    Turn history
                </div>

                <div className="cbf-helper-sidebar__history-scroller">
                    <div className="cbf-helper-sidebar__history-content">
                        {props.data.match.states.map((gameState, index) => (
                            renderMessage(gameState, index)
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

Sidebar.propTypes = {
    actions: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Sidebar));
