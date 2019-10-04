import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import ListModel from 'models/play/list';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';

class MyGames extends React.Component {
    getMatches() {
        return this.props.data.me.matches
            .filter((match) => match.status !== 'FINISHED');
    }

    openGameHandler = (id) => () => {
        this.props.history.push(`/play/${id}`);
    }

    render() {
        return (
            <div className="cbf-my-games">
                <Headline>My active games</Headline>

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
                                <Button onClick={this.openGameHandler(match.id)}>
                                    Open game
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

MyGames.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(MyGames));