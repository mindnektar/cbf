import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

const Hand = (props) => (
    <div className="azul__hand">
        {props.hand.map((tile, tileIndex) => (
            <Tile
                key={tileIndex}
                type={tile}
            />
        ))}
    </div>
);

Hand.propTypes = {
    hand: PropTypes.array.isRequired,
};

export default Hand;
