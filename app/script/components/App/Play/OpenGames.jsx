import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { joinGame } from 'actions/games';
import { push } from 'actions/history';
import Button from 'Button';
import Headline from 'Headline';
import games from 'data/games';
import gameConstants from 'shared/constants/games';

class OpenGames extends React.Component {
    getFilteredGames() {
        return Object.values(this.props.games).filter(game => (
            !this.props.myGames.find(myGame => myGame.id === game.id) &&
            game.status === gameConstants.GAME_STATUS_OPEN
        ));
    }

    joinGameHandler = id => () => {
        this.props.joinGame(id).then(() => {
            this.props.push('play', id);
        });
    }

    render() {
        return (
            <div className="cbf-open-games">
                <Headline>Open invitations</Headline>

                {this.getFilteredGames().map(game =>
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

OpenGames.propTypes = {
    games: PropTypes.object.isRequired,
    myGames: PropTypes.array.isRequired,
    joinGame: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
};

export default connectWithRouter(
    state => ({
        games: state.games,
        myGames: state.me.games,
    }),
    {
        joinGame,
        push,
    },
    OpenGames,
);
