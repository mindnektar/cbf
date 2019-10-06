import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ListModel from 'models/play/list';
import Headline from 'atoms/Headline';
import GameList from './GameList';

class OpenGames extends React.Component {
    getMatches() {
        return this.props.data.matches.filter((match) => {
            const maxPlayerCount = match.options
                .find(({ type }) => type === 'num-players')
                .values
                .reduce((result, current) => (
                    current > result ? current : result
                ), 0);

            return (
                !match.players.some(({ id }) => id === this.props.data.me.id)
                && match.players.length < maxPlayerCount
            );
        });
    }

    joinMatch = async (match) => {
        await this.props.joinMatch(match.id);

        this.props.history.push(`/play/${match.id}`);
    }

    render() {
        return (
            <div className="cbf-open-games">
                <Headline>Open invitations</Headline>

                <GameList
                    matches={this.getMatches()}
                    action={{ label: 'Join game', handler: this.joinMatch }}
                >
                    {(match) => (
                        match.players.map((player) => (
                            <div key={player.id}>
                                {player.name}
                            </div>
                        ))
                    )}
                </GameList>
            </div>
        );
    }
}

OpenGames.propTypes = {
    data: PropTypes.object.isRequired,
    joinMatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(OpenGames));
