import React from 'react';
import PropTypes from 'prop-types';
import Tile from '../Tile';

class Wall extends React.Component {
    render() {
        return (
            <div className="azul__wall">
                {this.props.wall.map((line, lineIndex) => (
                    line.map((item, itemIndex) => (
                        item !== null && (
                            <Tile
                                key={`${lineIndex}${itemIndex}`}
                                style={{ transform: `translate(${itemIndex * 101}%, ${lineIndex * 105}%)` }}
                                type={item}
                            />
                        )
                    ))
                ))}
            </div>
        );
    }
}

Wall.propTypes = {
    wall: PropTypes.array.isRequired,
};

export default Wall;
