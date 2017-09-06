import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import { openGame } from 'actions/games';
import gameConstants from 'shared/constants/games';
import Button from 'Button';
import Headline from 'Headline';

class Setup extends React.Component {
    componentWillMount() {
        if (this.props.game.status === gameConstants.GAME_STATUS_OPEN) {
            this.props.replace('play', this.props.game.id, 'lobby');
        }

        if (this.props.game.status === gameConstants.GAME_STATUS_ACTIVE) {
            this.props.replace('play', this.props.game.id);
        }
    }

    openGame = () => {
        this.props.openGame(this.props.game.id).then(() => {
            this.props.replace('play', this.props.game.id, 'lobby');
        });
    }

    render() {
        return (
            <div>
                <Headline>Configure your game</Headline>

                <Button
                    onTouchTap={this.openGame}
                >
                    Open game for joining
                </Button>
            </div>
        );
    }
}

Setup.propTypes = {
    game: PropTypes.object.isRequired,
    openGame: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        game: state.games[ownProps.match.params.gameId],
    }),
    {
        openGame,
        replace,
    },
    Setup
);
