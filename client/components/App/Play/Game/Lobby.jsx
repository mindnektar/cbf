import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import games from 'data/games';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';

const Lobby = (props) => {
    const possiblePlayers = [...games[props.data.match.handle].playerCount];
    const hasValidPlayerCount = possiblePlayers.includes(props.data.match.players.length);
    const maxPlayerCount = possiblePlayers.reduce((result, current) => (
        current > result ? current : result
    ), 0);
    const { players } = props.data.match;

    useEffect(() => {
        if (props.data.match.status === 'SETTING_UP') {
            props.history.replace(`/play/${props.data.match.id}/setup`);
        } else if (props.data.match.status === 'ACTIVE') {
            props.history.replace(`/play/${props.data.match.id}`);
        }
    }, []);

    const startMatch = () => {
        props.startMatch(props.data.match.id).then(() => {
            props.history.replace(`/play/${props.data.match.id}`);
        });
    };

    const renderPlayerSlot = (_, index) => {
        const player = players[index] || {
            id: index,
            name: <span className="cbf-game-lobby__player-empty">Waiting for player...</span>,
        };

        return (
            <div
                className="cbf-game-lobby__player"
                key={player.id}
            >
                {player.name}

                <span className="cbf-game-lobby__player-admin">
                    {player.id === props.data.match.creator.id && 'Admin'}
                </span>
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
