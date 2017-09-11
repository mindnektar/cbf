import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { createGame } from 'actions/games';
import { push } from 'actions/history';
import Button from 'Button';
import Headline from 'Headline';
import games from 'data/games';

class AllGames extends React.Component {
    createGameHandler = handle => () => {
        this.props.createGame(handle).then((newGame) => {
            this.props.push('play', newGame.id);
        });
    }

    render() {
        return (
            <div className="cbf-all-games">
                <Headline>All games</Headline>

                {Object.values(games).map(game =>
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
                                <div>{game.playerCount} players</div>
                                <div>{game.playTime} minutes</div>
                            </div>

                            <div className="cbf-all-games__item-options">
                                {this.props.me &&
                                    <Button
                                        onTouchTap={this.createGameHandler(game.handle)}
                                    >
                                        Start new game
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

AllGames.defaultProps = {
    me: null,
};

AllGames.propTypes = {
    createGame: PropTypes.func.isRequired,
    me: PropTypes.object,
    push: PropTypes.func.isRequired,
};

export default connectWithRouter(
    state => ({
        me: state.me,
    }),
    {
        createGame,
        push,
    },
    AllGames,
);
