import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import GameModel from 'models/play/game';
import gameComponents from 'components/App/games';

class Arena extends React.Component {
    state = {
        moving: false,
        x: 0,
        y: 0,
        zoom: 1,
    };

    componentWillMount() {
        if (this.props.data.match.status === 'SETTING_UP') {
            this.props.history.replace(`/play/${this.props.data.match.id}/setup`);
            return;
        }

        if (this.props.data.match.status === 'OPEN') {
            this.props.history.replace(`/play/${this.props.data.match.id}/lobby`);
            return;
        }

        this.setZoom();
    }

    componentDidMount() {
        this.arenaRef.addEventListener('mousewheel', this.changeZoom);
        this.arenaRef.addEventListener('DOMMouseScroll', this.changeZoom);
    }

    componentWillUnmount() {
        // this.props.clearGameStates();

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
        // const { offsetHeight, offsetWidth } = document.querySelector('.cbf-helper-game');
        // const heightRatio = (window.innerHeight - 226) / offsetHeight;
        // const widthRatio = (window.innerWidth - 396) / offsetWidth;
        //
        // this.setState({
        //     zoom: heightRatio < widthRatio ? heightRatio : widthRatio,
        // });
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
                    {React.createElement(gameComponents[this.props.data.match.handle])}
                </div>
            </div>
        );
    }
}

Arena.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default GameModel.graphql(withRouter(Arena));
