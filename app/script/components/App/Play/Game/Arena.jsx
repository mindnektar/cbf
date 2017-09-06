import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import { loadGameStates } from 'actions/populate';
import gameConstants from 'shared/constants/games';
import gameComponents from 'components/App/games';

class Arena extends React.Component {
    componentWillMount() {
        if (this.props.game.status === gameConstants.GAME_STATUS_SETTING_UP) {
            this.props.replace('play', this.props.game.id, 'setup');
            return;
        }

        if (this.props.game.status === gameConstants.GAME_STATUS_OPEN) {
            this.props.replace('play', this.props.game.id, 'lobby');
            return;
        }

        this.props.loadGameStates(this.props.game.id);
    }

    render() {
        return (
            <div>
                {this.props.gameStates &&
                    React.createElement(gameComponents[this.props.game.handle])
                }
            </div>
        );
    }
}

Arena.defaultProps = {
    gameStates: null,
};

Arena.propTypes = {
    game: PropTypes.object.isRequired,
    gameStates: PropTypes.array,
    loadGameStates: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        game: state.games[ownProps.match.params.gameId],
        gameStates: state.gameStates,
    }),
    {
        loadGameStates,
        replace,
    },
    Arena
);
