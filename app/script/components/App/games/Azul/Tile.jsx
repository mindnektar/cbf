import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';

class Tile extends React.Component {
    render() {
        return (
            <div
                className={classNames(
                    'azul__tile',
                    `azul__tile-${this.props.type}`
                )}
            />
        );
    }
}

Tile.propTypes = {
    type: PropTypes.number.isRequired,
};

export default connectWithRouter(
    null,
    null,
    Tile
);
