import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import gameConstants from 'shared/constants/games';

class Setup extends React.Component {
    componentWillMount() {
        if (this.props.game.status === gameConstants.GAME_STATUS_OPEN) {
            this.props.replace('play', this.props.game.id, 'lobby');
        }

        if (this.props.game.status === gameConstants.GAME_STATUS_ACTIVE) {
            this.props.replace('play', this.props.game.id);
        }
    }

    render() {
        return (
            <div>
                Setup
            </div>
        );
    }
}

Setup.propTypes = {
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
    Setup
);
