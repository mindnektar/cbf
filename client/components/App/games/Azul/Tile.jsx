import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tile = React.forwardRef((props, ref) => (
    <div
        className={classNames(
            'azul__tile',
            `azul__tile-${props.type}`
        )}
        style={props.style}
        ref={ref}
    />
));

Tile.defaultProps = {
    style: {},
};

Tile.propTypes = {
    style: PropTypes.object,
    type: PropTypes.number.isRequired,
};

export default Tile;
