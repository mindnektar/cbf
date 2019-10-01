import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import GameModel from 'models/play/game';

const Sidebar = (props) => {
    const switchGameStateHandler = (index) => () => {
        props.goToAction({
            id: props.data.match.id,
            index,
        });
    };

    const renderMessage = (gameState, index) => {
        if (index === 0) {
            return (
                <div
                    className={classNames(
                        'cbf-sidebar__history-item',
                        {
                            'cbf-sidebar__history-item--active': index === props.data.match.stateIndex,
                        }
                    )}
                    key={messageIndex}
                    onClick={switchGameStateHandler(index)}
                >
                    Start of match
                </div>
            );
        }

        const { player, type, payload } = props.data.match.actions[index];
        const message = games[props.data.match.handle].actions.findById(type).toString({
            me: (
                props.data.match.actions[index].player
                || props.data.match.players.find(({ id }) => (
                    id === props.data.match.states[index - 1].activePlayers[0]
                ))
            ),
            payload,
            state: gameState,
            previousState: props.data.match.states[index - 1],
            players: props.data.match.players,
        });

        if (!message) {
            return null;
        }

        const playerId = player ? player.id : null;
        const groupStart = actionOwner !== playerId;

        messageIndex += 1;
        actionOwner = playerId;

        return (
            <div
                className={classNames(
                    'cbf-sidebar__history-item',
                    {
                        'cbf-sidebar__history-item--active': index === props.data.match.stateIndex,
                        'cbf-sidebar__history-item--group-start': groupStart,
                    }
                )}
                key={messageIndex}
                onClick={switchGameStateHandler(index)}
            >
                <div className="cbf-sidebar__history-index">
                    {messageIndex}
                </div>

                <div className="cbf-sidebar__history-message">
                    {message}
                </div>
            </div>
        );
    };

    let messageIndex = 0;
    let actionOwner = null;
    const players = props.players.sort((a, b) => b.score - a.score);

    return (
        <div
            className="cbf-sidebar"
            onMouseDown={(event) => event.stopPropagation()}
        >
            <div className="cbf-sidebar__history">
                <div className="cbf-sidebar__history-header">
                    Turn history
                </div>

                <div className="cbf-sidebar__history-scroller">
                    {props.isGameFinished && (
                        <div className="cbf-sidebar__history-scores">
                            Game over!

                            {players.map((player, index) => (
                                <div
                                    className="cbf-sidebar__history-scores-player"
                                    key={player.id}
                                >
                                    <span>
                                        #
                                        {index + 1}
                                        :&nbsp;
                                    </span>

                                    {player.name}
                                    ,&nbsp;
                                    {player.score}
                                    &nbsp;points
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="cbf-sidebar__history-content">
                        {props.data.match.states.map((gameState, index) => (
                            renderMessage(gameState, index)
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    data: PropTypes.object.isRequired,
    isGameFinished: PropTypes.bool.isRequired,
    players: PropTypes.array.isRequired,
    goToAction: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Sidebar));
