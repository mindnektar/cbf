import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ScoreMarker from './Board/ScoreMarker';
import PatternLines from './Board/PatternLines';
import Wall from './Board/Wall';
import FloorLine from './Board/FloorLine';

const Board = (props) => (
    <div
        className={classNames(
            'azul__board-wrapper',
            `player-${props.playerIndex}`
        )}
    >
        <div className="azul__board">
            <ScoreMarker score={props.player.score} />

            <div className="azul__board-middle">
                <PatternLines
                    lines={props.player.patternLines}
                    actionsDisabled={props.actionsDisabled}
                    playerIndex={props.playerIndex}
                />

                <Wall
                    wall={props.player.wall}
                    playerIndex={props.playerIndex}
                />
            </div>

            <FloorLine
                floorLine={props.player.floorLine}
                actionsDisabled={props.actionsDisabled}
            />
        </div>
    </div>
);

Board.propTypes = {
    player: PropTypes.object.isRequired,
    playerIndex: PropTypes.number.isRequired,
    actionsDisabled: PropTypes.bool.isRequired,
};

export default Board;
