import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ListModel from 'models/play/list';
import GameList from './GameList';

const OpenInvitations = (props) => {
    const matches = props.data.matches.filter((match) => {
        const maxPlayerCount = match.options
            .find(({ type }) => type === 'num-players')
            .values
            .reduce((result, current) => (
                current > result ? current : result
            ), 0);

        return (
            !match.players.some(({ id }) => id === props.data.me.id)
            && match.players.length < maxPlayerCount
        );
    });

    const joinMatch = async (match) => {
        await props.joinMatch(match.id);

        props.history.push(`/play/${match.id}`);
    };

    return (
        <GameList
            matches={matches}
            action={{ label: 'Join game', handler: joinMatch }}
        >
            {(match) => (
                match.players.map((player) => (
                    <div key={player.id}>
                        {player.name}
                    </div>
                ))
            )}
        </GameList>
    );
};

OpenInvitations.propTypes = {
    data: PropTypes.object.isRequired,
    joinMatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(OpenInvitations));
