import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import Tile from './Tile';

class Factory extends React.Component {
    render() {
        return (
            <div className="azul__factory">
                {this.props.factoryTiles.map((display, index) =>
                    <div
                        className="azul__factory-display"
                        key={index}
                    >
                        {display.map((tile, tileIndex) =>
                            <Tile key={tileIndex} type={tile} />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

Factory.propTypes = {
    factoryTiles: PropTypes.array.isRequired,
};

export default connectWithRouter(
    null,
    null,
    Factory
);
