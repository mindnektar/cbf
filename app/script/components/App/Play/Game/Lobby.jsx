import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import gameConstants from 'shared/constants/games';

class Lobby extends React.Component {
    componentWillMount() {
        if (this.props.game.status === gameConstants.GAME_STATUS_SETTING_UP) {
            this.props.replace('play', this.props.game.id, 'setup');
        }

        if (this.props.game.status === gameConstants.GAME_STATUS_ACTIVE) {
            this.props.replace('play', this.props.game.id);
        }
    }

    render() {
        return (
            <div>
                Lobby
            </div>
        );
    }
}

Lobby.propTypes = {
    game: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        game: state.games[ownProps.match.params.gameId],
    }),
    {
        replace,
    },
    Lobby
);
