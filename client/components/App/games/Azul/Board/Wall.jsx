import React from 'react';
import PropTypes from 'prop-types';
import Tile from '../Tile';

const Wall = (props) => {
    const isReversedPlayer = props.playerIndex % 2 === 1;
    const alteredWall = isReversedPlayer ? [...props.wall].reverse() : props.wall;

    const renderLine = (line, lineIndex) => {
        const alteredLine = isReversedPlayer ? [...line].reverse() : line;

        return alteredLine.map((tile, tileIndex) => {
            if (tile === null) {
                return null;
            }

            const left = isReversedPlayer
                ? ((line.length - 1) * 40) - (tileIndex * 40)
                : tileIndex * 40;
            const top = isReversedPlayer
                ? ((line.length - 1) * 41) - (lineIndex * 41)
                : lineIndex * 41;

            return (
                <Tile
                    key={`${lineIndex}${tileIndex}`}
                    style={{ left, top }}
                    type={tile}
                />
            );
        });
    };

    return (
        <div className="azul__wall">
            {alteredWall.map(renderLine)}
        </div>
    );
};

Wall.propTypes = {
    wall: PropTypes.array.isRequired,
    playerIndex: PropTypes.number.isRequired,
};

export default Wall;
