import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import GameModel from 'models/play/game';
import gameComponents from 'components/App/games';
import Table from './Arena/Table';
import Sidebar from './Arena/Sidebar';
import Status from './Arena/Status';

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
        } else if (this.props.data.match.status === 'OPEN') {
            this.props.history.replace(`/play/${this.props.data.match.id}/lobby`);
        }
    }

    componentDidMount() {
        if (!this.arenaRef) {
            return;
        }

        this.arenaRef.addEventListener('mousewheel', this.changeZoom);
        this.arenaRef.addEventListener('DOMMouseScroll', this.changeZoom);

        this.setZoom();
    }

    componentWillUnmount() {
        if (!this.arenaRef) {
            return;
        }

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
            const movement = { x: event.movementX, y: event.movementY };

            this.setState((prevState) => ({
                x: prevState.x - (movement.x / prevState.zoom),
                y: prevState.y - (movement.y / prevState.zoom),
            }));
        }
    }

    onMouseUp = () => {
        this.setState({ moving: false });
    }

    setArenaRef = (ref) => {
        this.arenaRef = ref;
    }

    setZoom = () => {
        const { offsetHeight, offsetWidth } = document.querySelector('.cbf-table');
        const heightRatio = (window.innerHeight - 226) / offsetHeight;
        const widthRatio = (window.innerWidth - 396) / offsetWidth;
        const zoom = heightRatio < widthRatio ? heightRatio : widthRatio;

        this.setState({
            zoom,
            minimumZoom: zoom,
        });
    }

    changeZoom = (event) => {
        event.preventDefault();

        const delta = event.deltaY ? event.deltaY / 400 : event.detail / 100;

        this.setState((prevState) => ({
            zoom: Math.max(
                prevState.minimumZoom,
                Math.min(
                    prevState.minimumZoom * 5,
                    prevState.zoom - delta
                )
            ),
        }));
    }

    render() {
        return this.props.data.match.status === 'ACTIVE' && (
            <>
                <Status />

                <Sidebar
                    isGameFinished={this.props.data.match.status === 'FINISHED'}
                    players={this.props.data.match.players}
                />

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
                        <Table>
                            {React.createElement(gameComponents[this.props.data.match.handle])}
                        </Table>
                    </div>
                </div>
            </>
        );
    }
}

Arena.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default GameModel.graphql(withRouter(Arena));
