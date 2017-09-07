import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { replace } from 'actions/history';
import { clearGameStates, loadGameStates } from 'actions/populate';
import gameConstants from 'shared/constants/games';
import gameComponents from 'components/App/games';

class Arena extends React.Component {
    state = {
        moving: false,
        x: 0,
        y: 0,
    };

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

    componentWillUnmount() {
        this.props.clearGameStates();
    }

    onMouseDown = () => {
        this.setState({ moving: true });
    }

    onMouseLeave = () => {
        this.setState({ moving: false });
    }

    onMouseMove = (event) => {
        if (this.state.moving) {
            this.setState({
                x: this.state.x - event.nativeEvent.movementX,
                y: this.state.y - event.nativeEvent.movementY,
            });
        }
    }

    onMouseUp = () => {
        this.setState({ moving: false });
    }

    render() {
        return (
            <div
                className="cbf-arena"
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                <div
                    className={classNames(
                        'cbf-arena__canvas',
                        { 'cbf-arena__canvas--moving': this.state.moving }
                    )}
                    style={{
                        margin: `${-this.state.y}px 0 0 ${-this.state.x}px`,
                    }}
                >
                    {this.props.gameStates &&
                        React.createElement(gameComponents[this.props.game.handle])
                    }
                </div>
            </div>
        );
    }
}

Arena.defaultProps = {
    gameStates: null,
};

Arena.propTypes = {
    clearGameStates: PropTypes.func.isRequired,
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
        clearGameStates,
        loadGameStates,
        replace,
    },
    Arena
);
