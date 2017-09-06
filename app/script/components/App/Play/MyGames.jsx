import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { push } from 'actions/history';
import Button from 'Button';
import Headline from 'Headline';
import games from 'data/games';

class MyGames extends React.Component {
    openGameHandler = id => () => {
        this.props.push('play', id);
    }

    render() {
        return (
            <div className="cbf-my-games">
                <Headline>My active games</Headline>

                {Object.values(this.props.myGames).map(game =>
                    <div
                        className="cbf-all-games__item"
                        key={game.id}
                    >
                        <div className="cbf-all-games__item-image">
                            <img
                                src={`/img/games/${this.props.games[game.id].handle}/box.jpg`}
                                alt={games[this.props.games[game.id].handle].title}
                            />
                        </div>

                        <div className="cbf-all-games__item-content">
                            <div className="cbf-all-games__item-details">
                                <div className="cbf-all-games__item-title">
                                    {games[this.props.games[game.id].handle].title}
                                </div>

                                {this.props.games[game.id].players.map(userId =>
                                    <div key={userId}>{this.props.users[userId].username}</div>
                                )}
                            </div>

                            <div className="cbf-all-games__item-options">
                                <Button
                                    onTouchTap={this.openGameHandler(game.id)}
                                >
                                    Open game
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

MyGames.propTypes = {
    games: PropTypes.object.isRequired,
    myGames: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default connectWithRouter(
    state => ({
        games: state.games,
        myGames: state.me.games,
        users: state.users,
    }),
    {
        push,
    },
    MyGames,
);
