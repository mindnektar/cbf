import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import ScoreTrack from './Board/ScoreTrack';
import PatternLines from './Board/PatternLines';
import Wall from './Board/Wall';
import FloorLine from './Board/FloorLine';

class Board extends React.Component {
    render() {
        return (
            <div className="azul__board">
                <ScoreTrack
                    score={this.props.player.score}
                />

                <div className="azul__board-middle">
                    <PatternLines
                        lines={this.props.player.patternLines}
                    />

                    <Wall
                        wall={this.props.player.wall}
                    />
                </div>

                <FloorLine
                    floorLine={this.props.player.floorLine}
                />
            </div>
        );
    }
}

Board.propTypes = {
    player: PropTypes.object.isRequired,
};

export default connectWithRouter(
    null,
    null,
    Board
);
