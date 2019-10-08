import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';

const Lobby = (props) => {
    const { participants, options, status, id } = props.data.match;

    useEffect(() => {
        if (status === 'SETTING_UP') {
            props.history.replace(`/play/${id}/setup`);
        } else if (status === 'ACTIVE') {
            props.history.replace(`/play/${id}`);
        }
    }, [status]);

    if (status !== 'OPEN') {
        return null;
    }

    const possiblePlayers = options.find(({ type }) => type === 'num-players').values;
    const confirmedPlayers = participants.filter(({ confirmed }) => confirmed);
    const hasValidPlayerCount = possiblePlayers.includes(confirmedPlayers.length);
    const maxPlayerCount = possiblePlayers.reduce((result, current) => (
        current > result ? current : result
    ), 0);

    const startMatch = () => {
        props.startMatch(props.data.match.id).then(() => {
            props.history.replace(`/play/${props.data.match.id}`);
        });
    };

    const removePlayerFromMatchHandler = (userId) => () => {
        props.removePlayerFromMatch({
            id: props.data.match.id,
            userId,
        })
    }

    const renderPlayerSlot = (_, index) => {
        const participant = participants[index] || {
            player: {
                id: index,
                name: <span className="cbf-game-lobby__player-empty">Waiting for player...</span>,
            },
            confirmed: false,
            dummy: true,
        };

        return (
            <div
                className={classNames(
                    'cbf-game-lobby__player',
                    { 'cbf-game-lobby__player--confirmed': participant.confirmed }
                )}
                key={participant.player.id}
            >
                <div className="cbf-game-lobby__player-confirmation">
                    &#x2714;
                </div>

                <div className="cbf-game-lobby__player-info">
                    {participant.player.name}

                    <div className="cbf-game-lobby__player-admin">
                        {participant.player.id === props.data.match.creator.id && 'Admin'}
                    </div>

                    {!participant.confirmed && !participant.dummy && (
                        <div
                            className="cbf-game-lobby__player-remove"
                            onClick={removePlayerFromMatchHandler(participant.player.id)}
                        >
                            Remove player
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <Headline>Lobby</Headline>

            <div className="cbf-game-lobby__players">
                {Array(maxPlayerCount).fill(null).map(renderPlayerSlot)}
            </div>

            {props.data.match.creator.id === props.data.me.id && (
                <Button
                    onClick={startMatch}
                    disabled={!hasValidPlayerCount}
                >
                    Start game
                </Button>
            )}
        </div>
    );
};

Lobby.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    startMatch: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Lobby));
