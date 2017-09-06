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

                {this.props.myGames.map(gameId =>
                    <div
                        className="cbf-all-games__item"
                        key={gameId}
                    >
                        <div className="cbf-all-games__item-image">
                            <img
                                src={`/img/games/${this.props.games[gameId].handle}/box.jpg`}
                                alt={games[this.props.games[gameId].handle].title}
                            />
                        </div>

                        <div className="cbf-all-games__item-content">
                            <div className="cbf-all-games__item-details">
                                <div className="cbf-all-games__item-title">
                                    {games[this.props.games[gameId].handle].title}
                                </div>
                            </div>

                            <div className="cbf-all-games__item-options">
                                <Button
                                    onTouchTap={this.openGameHandler(gameId)}
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
    myGames: PropTypes.array.isRequired,
    push: PropTypes.func.isRequired,
};

export default connectWithRouter(
    state => ({
        games: state.games,
        myGames: state.me.games,
    }),
    {
        push,
    },
    MyGames,
);
