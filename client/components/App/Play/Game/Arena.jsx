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
        zoom: 1,
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

        this.props.loadGameStates(this.props.game.id).then(this.setZoom);
    }

    componentDidMount() {
        this.arenaRef.addEventListener('mousewheel', this.changeZoom);
        this.arenaRef.addEventListener('DOMMouseScroll', this.changeZoom);
    }

    componentWillUnmount() {
        this.props.clearGameStates();

        this.arenaRef.removeEventListener('mousewheel', this.changeZoom);
        this.arenaRef.removeEventListener('DOMMouseScroll', this.changeZoom);
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
                x: this.state.x - (event.nativeEvent.movementX / this.state.zoom),
                y: this.state.y - (event.nativeEvent.movementY / this.state.zoom),
            });
        }
    }

    onMouseUp = () => {
        this.setState({ moving: false });
    }

    setArenaRef = (ref) => {
        this.arenaRef = ref;
    }

    setZoom = () => {
        const { offsetHeight, offsetWidth } = document.querySelector('.cbf-helper-game');
        const heightRatio = (window.innerHeight - 226) / offsetHeight;
        const widthRatio = (window.innerWidth - 396) / offsetWidth;

        this.setState({
            zoom: heightRatio < widthRatio ? heightRatio : widthRatio,
        });
    }

    changeZoom = (event) => {
        event.preventDefault();

        const delta = event.deltaY ? event.deltaY / 400 : event.detail / 100;

        const zoom = Math.max(
            0.3,
            Math.min(
                2.5,
                this.state.zoom -= delta
            )
        );

        this.setState({ zoom });
    }

    render() {
        return (
            <div
                className={classNames(
                    'cbf-arena',
                    { 'cbf-arena--moving': this.state.moving }
                )}
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onScroll={this.onScroll}
                ref={this.setArenaRef}
            >
                <div
                    className="cbf-arena__canvas"
                    style={{
                        transform: `scale(${this.state.zoom}) translate(${-this.state.x}px, ${-this.state.y}px)`,
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
    gameStates: PropTypes.object,
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