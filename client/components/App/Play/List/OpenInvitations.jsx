import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ListModel from 'models/play/list';
import GameList from './GameList';

const OpenInvitations = (props) => {
    const joinMatch = async (match) => {
        await props.joinMatch(match.id);

        props.history.push(`/play/${match.id}`);
    };

    return (
        <div className="cbf-open-invitations">
            <GameList
                matches={props.matches}
                action={{ label: 'Join game', handler: joinMatch }}
            >
                {(match) => (
                    match.participants.map(({ player }) => (
                        <div key={player.id}>
                            {player.name}
                        </div>
                    ))
                )}
            </GameList>
        </div>
    );
};

OpenInvitations.propTypes = {
    matches: PropTypes.array.isRequired,
    joinMatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(OpenInvitations));
