import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import gameConstants from 'shared/constants/games';

class Arena extends React.Component {
    componentWillMount() {
        if (this.props.game.status === gameConstants.GAME_STATUS_SETTING_UP) {
            this.props.replace('play', this.props.game.id, 'setup');
        }

        if (this.props.game.status === gameConstants.GAME_STATUS_OPEN) {
            this.props.replace('play', this.props.game.id, 'lobby');
        }
    }

    render() {
        return (
            <div>
                Arena
            </div>
        );
    }
}

Arena.propTypes = {
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
    Arena
);
