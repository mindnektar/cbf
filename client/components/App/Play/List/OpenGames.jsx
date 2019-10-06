import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import ListModel from 'models/play/list';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';

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

    joinMatchHandler = (id) => async () => {
        await this.props.joinMatch(id);

        this.props.history.push(`/play/${id}`);
    }

    render() {
        return (
            <div className="cbf-open-games">
                <Headline>Open invitations</Headline>

                {this.getMatches().map((match) => (
                    <div
                        className="cbf-all-games__item"
                        key={match.id}
                    >
                        <div className="cbf-all-games__item-image">
                            <img
                                src={`/img/games/${match.handle}/box.jpg`}
                                alt={games[match.handle].title}
                            />
                        </div>

                        <div className="cbf-all-games__item-content">
                            <div className="cbf-all-games__item-details">
                                <div className="cbf-all-games__item-title">
                                    {games[match.handle].title}
                                </div>

                                {match.players.map((player) => (
                                    <div key={player.id}>
                                        {player.name}
                                    </div>
                                ))}
                            </div>

                            <div className="cbf-all-games__item-options">
                                <Button onClick={this.joinMatchHandler(match.id)}>
                                    Join game
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
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
