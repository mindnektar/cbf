import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import Tile from '../Tile';

class Wall extends React.Component {
    render() {
        return (
            <div className="azul__wall">
                {this.props.wall.map((line, index) => (
                    <div
                        className="azul__pattern-line"
                        key={index}
                    >
                        {line.map((lineItem, itemIndex) => (
                            <div
                                className="azul__pattern-line-item"
                                key={itemIndex}
                            >
                                {lineItem !== null &&
                                    <Tile type={lineItem} />
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

Wall.propTypes = {
    wall: PropTypes.array.isRequired,
};

export default connectWithRouter(
    null,
    null,
    Wall
);
