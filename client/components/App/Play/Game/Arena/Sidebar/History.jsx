import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import GameModel from 'models/play/game';

const History = (props) => {
    let messageIndex = 0;
    let actionOwner = null;
    const players = props.players.sort((a, b) => b.score - a.score);

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
                        'cbf-history__item',
                        {
                            'cbf-history__item--active': index === props.data.match.stateIndex,
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
                    'cbf-history__item',
                    {
                        'cbf-history__item--active': index === props.data.match.stateIndex,
                        'cbf-history__item--group-start': groupStart,
                    }
                )}
                key={messageIndex}
                onClick={switchGameStateHandler(index)}
            >
                <div className="cbf-history__index">
                    {messageIndex}
                </div>

                <div className="cbf-history__message">
                    {actionText}
                </div>
            </div>
        );
    };

    return (
        <div className="cbf-history">
            {props.isGameFinished && (
                <div className="cbf-history__scores">
                    Game over!

                    {players.map((player, index) => (
                        <div
                            className="cbf-history__scores-player"
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

            <div className="cbf-history__content">
                {props.data.match.states.map((gameState, index) => (
                    renderMessage(gameState, index)
                ))}
            </div>
        </div>
    );
};

History.propTypes = {
    data: PropTypes.object.isRequired,
    isGameFinished: PropTypes.bool.isRequired,
    players: PropTypes.array.isRequired,
    goToAction: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(History));
