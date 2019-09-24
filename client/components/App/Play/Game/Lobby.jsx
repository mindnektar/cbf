import React from 'react';
import PropTypes from 'prop-types';
import gameConstants from 'shared/constants/games';
import games from 'data/games';
import Button from 'Button';
import Headline from 'Headline';

class Lobby extends React.Component {
    componentWillMount() {
        if (this.props.game.status === gameConstants.GAME_STATUS_SETTING_UP) {
            this.props.replace('play', this.props.game.id, 'setup');
        }

        if (this.props.game.status === gameConstants.GAME_STATUS_ACTIVE) {
            this.props.replace('play', this.props.game.id);
        }
    }

    startGame = () => {
        this.props.startGame(this.props.game.id).then(() => {
            this.props.replace('play', this.props.game.id);
        });
    }

    render() {
        return (
            <div>
                <Headline>Lobby</Headline>

                {this.props.game.players.map((userId, index) => (
                    <div
                        className="cbf-game-lobby__player"
                        key={userId}
                    >
                        {this.props.users[userId].username}

                        {userId === this.props.me.id && index === 0 && ' (Admin)'}
                    </div>
                ))}

                {
                    games[this.props.game.handle].playerCount
                        .includes(this.props.game.players.length)
                    && this.props.game.players[0] === this.props.me.id
                    && (
                        <Button
                            onClick={this.startGame}
                        >
                            Start game
                        </Button>
                    )
                }
            </div>
        );
    }
}

Lobby.propTypes = {
    game: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
};

export default Lobby;
