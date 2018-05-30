import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { push } from 'actions/history';
import Button from 'Button';
import Headline from 'Headline';
import games from 'data/games';
import gameConstants from 'shared/constants/games';

class MyGames extends React.Component {
    getFilteredGames() {
        return Object.values(this.props.games).filter(game => (
            game.status === gameConstants.GAME_STATUS_FINISHED &&
            game.players.includes(this.props.me.id)
        ));
    }

    openGameHandler = id => () => {
        this.props.push('play', id);
    }

    render() {
        return (
            <div className="cbf-my-games">
                <Headline>Finished games</Headline>

                {this.getFilteredGames().map(game => (
                    <div
                        className="cbf-all-games__item"
                        key={game.id}
                    >
                        <div className="cbf-all-games__item-image">
                            <img
                                src={`/img/games/${game.handle}/box.jpg`}
                                alt={games[game.handle].title}
                            />
                        </div>

                        <div className="cbf-all-games__item-content">
                            <div className="cbf-all-games__item-details">
                                <div className="cbf-all-games__item-title">
                                    {games[game.handle].title}
                                </div>

                                {game.scores.map((item, index) => (
                                    <div key={item.player}>
                                        {index + 1}.&nbsp;
                                        {this.props.users[item.player].username}&nbsp;
                                        ({item.score} points)
                                    </div>
                                ))}
                            </div>

                            <div className="cbf-all-games__item-options">
                                <Button onTouchTap={this.openGameHandler(game.id)}>
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
    games: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    state => ({
        games: state.games,
        me: state.me,
        users: state.users,
    }),
    {
        push,
    },
    MyGames,
);