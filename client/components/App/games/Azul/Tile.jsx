import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Tile extends React.Component {
    render() {
        return (
            <div
                className={classNames(
                    'azul__tile',
                    `azul__tile-${this.props.type}`
                )}
                style={this.props.style}
            />
        );
    }
}

Tile.defaultProps = {
    style: {},
};

Tile.propTypes = {
    style: PropTypes.object,
    type: PropTypes.number.isRequired,
};

export default Tile;
