import React from 'react';
import PropTypes from 'prop-types';

const Player = (props) => (
    <div className="cbf-helper-player">
        {props.name}
    </div>
);

Player.defaultProps = {
    color: null,
};

Player.propTypes = {
    color: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default Player;
