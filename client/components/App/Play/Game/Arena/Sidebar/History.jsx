import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import determineRanks from 'helpers/determineRanks';
import games from 'data/games';
import GameModel from 'models/play/game';

const History = (props) => {
    let messageIndex = 0;
    let actionOwner = null;

    const switchGameStateHandler = (index) => () => {
        props.goToAction({
            id: props.data.match.id,
            index,
            historyMode: true,
        });
    };

    const renderResults = () => {
        if (!props.isGameFinished) {
            return null;
        }

        return (
            <div className="cbf-history__scores">
                Game over!

                {determineRanks(props.scores).map((score) => (
                    <div
                        className="cbf-history__scores-player"
                        key={score.player.id}
                    >
                        <span
                            className={classNames(
                                'cbf-history__scores-player-name',
                                { 'cbf-history__scores-player-name--winner': score.rank === 1 }
                            )}
                        >
                            #
                            {score.rank}
                            :&nbsp;
                            {score.player.name}
                        </span>

                        &nbsp;(
                        {games[props.data.match.handle].actions.END_GAME.formatScores(score.values)}
                        )
                    </div>
                ))}
            </div>
        );
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
            {renderResults()}

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
    scores: PropTypes.array.isRequired,
    goToAction: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(History));
