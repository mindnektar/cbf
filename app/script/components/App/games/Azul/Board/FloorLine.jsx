import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import Tile from '../Tile';

class FloorLine extends React.Component {
    render() {
        return (
            <div className="azul__floor-line">
                {this.props.floorLine.map((lineItem, itemIndex) =>
                    <div
                        className="azul__pattern-line-item"
                        key={itemIndex}
                    >
                        {lineItem &&
                            <Tile type={lineItem} />
                        }
                    </div>
                )}
            </div>
        );
    }
}

FloorLine.propTypes = {
    floorLine: PropTypes.array.isRequired,
};

export default connectWithRouter(
    null,
    null,
    FloorLine
);
