import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import Button from 'Button';

const games = [
    {
        id: 'five-tribes',
        title: 'Five Tribes',
        author: 'Bruno Cathala',
        playerCount: '2-4',
        playTime: '40-80',
    },
];

class AllGames extends React.Component {
    createGameHandler = id => () => {
        
    }

    render() {
        return (
            <div className="cbf-all-games">
                {games.map(game =>
                    <div
                        className="cbf-all-games__item"
                        key={game.id}
                    >
                        <div className="cbf-all-games__item-image">
                            <img src={`/img/games/${game.id}/box.jpg`} alt={game.title} />
                        </div>

                        <div className="cbf-all-games__item-content">
                            <div className="cbf-all-games__item-details">
                                <div className="cbf-all-games__item-title">{game.title}</div>
                                <div>{game.author}</div>
                                <div>{game.playerCount} players</div>
                                <div>{game.playTime} minutes</div>
                            </div>

                            <div className="cbf-all-games__item-options">
                                <Button
                                    onTouchTap={this.createGameHandler(game.id)}
                                >
                                    Start new game
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

AllGames.propTypes = {

};

export default connectWithRouter(
    null,
    null,
    AllGames,
);
