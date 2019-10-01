import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import games from 'data/games';
import GameModel from 'models/play/game';
import TextField from 'atoms/TextField';

const Sidebar = (props) => {
    const tabs = ['Turn history', 'Chat'];
    const [activeTab, setActiveTab] = useState('Turn history');
    const [message, setMessage] = useState('');

    const changeTabHandler = (tab) => () => {
        setActiveTab(tab);
    };

    const switchGameStateHandler = (index) => () => {
        props.goToAction({
            id: props.data.match.id,
            index,
        });
    };

    const changeMessage = (event) => {
        setMessage(event.target.value);
    };

    const submitMessage = () => {
        props.createMessage({
            id: props.data.match.id,
            text: message,
        });
        setMessage('');
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
        const actionText = games[props.data.match.handle].actions.findById(type).toString({
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

        if (!actionText) {
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
                    {actionText}
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
            <div className="cbf-sidebar__tabs">
                {tabs.map((tab) => (
                    <div
                        className={classNames(
                            'cbf-sidebar__tab',
                            { 'cbf-sidebar__tab--active': tab === activeTab }
                        )}
                        onClick={changeTabHandler(tab)}
                        key={tab}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {activeTab === 'Turn history' && (
                <div className="cbf-sidebar__history">
                    <div className="cbf-sidebar__scroller">
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
            )}

            {activeTab === 'Chat' && (
                <div className="cbf-sidebar__chat">
                    <TextField
                        onChange={changeMessage}
                        onSubmit={submitMessage}
                    >
                        {message}
                    </TextField>

                    <div className="cbf-sidebar__scroller">
                        <div className="cbf-sidebar__chat-content">
                            {props.data.match.messages.map((item) => (
                                <div
                                    className={classNames(
                                        'cbf-sidebar__message',
                                        { 'cbf-sidebar__message--mine': item.author.id === props.data.me.id }
                                    )}
                                    key={item.id}
                                >
                                    <div className="cbf-sidebar__message-author">
                                        {item.author.name}
                                    </div>

                                    <div className="cbf-sidebar__message-text">
                                        {item.text}
                                    </div>

                                    <div className="cbf-sidebar__message-date">
                                        {moment(item.createdAt).format('LLL')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

Sidebar.propTypes = {
    data: PropTypes.object.isRequired,
    isGameFinished: PropTypes.bool.isRequired,
    players: PropTypes.array.isRequired,
    goToAction: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Sidebar));
