import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import PlayModel from 'models/play';
import Button from 'atoms/Button';
import Headline from 'atoms/Headline';

class AllGames extends React.Component {
    createMatchHandler = (handle) => async () => {
        const { data } = await this.props.createMatch({ handle });

        this.props.history.push(`/play/${data.createMatch.id}`);
    }

    render() {
        return (
            <div className="cbf-all-games">
                <Headline>All games</Headline>

                {Object.values(games).map((game) => (
                    <div
                        className="cbf-all-games__item"
                        key={game.handle}
                    >
                        <div className="cbf-all-games__item-image">
                            <img src={`/img/games/${game.handle}/box.jpg`} alt={game.title} />
                        </div>

                        <div className="cbf-all-games__item-content">
                            <div className="cbf-all-games__item-details">
                                <div className="cbf-all-games__item-title">{game.title}</div>
                                <div>{game.author}</div>
                                <div>
                                    {game.playerCount[0]}
                                    -
                                    {game.playerCount[game.playerCount.length - 1]}
                                    &nbsp;
                                    players
                                </div>
                                <div>
                                    {game.playTime}
                                    &nbsp;
                                    minutes
                                </div>
                            </div>

                            <div className="cbf-all-games__item-options">
                                {this.props.data.me && (
                                    <Button
                                        onClick={this.createMatchHandler(game.handle)}
                                    >
                                        Start new game
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

AllGames.propTypes = {
    createMatch: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default PlayModel.graphql(withRouter(AllGames));
