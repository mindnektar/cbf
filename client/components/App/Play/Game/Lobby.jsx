import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import gameConstants from 'shared/constants/games';
import games from 'data/games';
import Button from 'Button';
import Headline from 'Headline';

class Lobby extends React.Component {
    componentWillMount() {
        if (this.props.data.match.status === gameConstants.GAME_STATUS_SETTING_UP) {
            this.props.history.replace(`/play/${this.props.data.match.id}/setup`);
        }

        if (this.props.data.match.status === gameConstants.GAME_STATUS_ACTIVE) {
            this.props.history.replace(`/play/${this.props.data.match.id}`);
        }
    }

    startMatch = () => {
        this.props.startMatch(this.props.data.match.id).then(() => {
            this.props.history.replace(`/play/${this.props.data.match.id}`);
        });
    }

    render() {
        return (
            <div>
                <Headline>Lobby</Headline>

                {this.props.data.match.players.map((player) => (
                    <div
                        className="cbf-game-lobby__player"
                        key={player.id}
                    >
                        {player.name}

                        {player.id === this.props.data.match.creator.id && ' (Admin)'}
                    </div>
                ))}

                {
                    games[this.props.data.match.handle].playerCount
                        .includes(this.props.data.match.players.length)
                    && this.props.data.match.creator.id === this.props.data.me.id
                    && (
                        <Button
                            onClick={this.startMatch}
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
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    startMatch: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Lobby));
