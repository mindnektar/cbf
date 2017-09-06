import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { startGame } from 'actions/games';
import { replace } from 'actions/history';
import gameConstants from 'shared/constants/games';
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

                {this.props.game.players.map(userId =>
                    <div
                        className="cbf-game-lobby__player"
                        key={userId}
                    >
                        {this.props.users[userId].username}

                        {
                            userId === this.props.me.id &&
                            !!this.props.me.games[this.props.game.id].admin &&
                            ' (Admin)'
                        }
                    </div>
                )}

                {this.props.game.players.length === 2 &&
                    <Button
                        onTouchTap={this.startGame}
                    >
                        Start game
                    </Button>
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

export default connectWithRouter(
    (state, ownProps) => ({
        game: state.games[ownProps.match.params.gameId],
        me: state.me,
        users: state.users,
    }),
    {
        replace,
        startGame,
    },
    Lobby
);
