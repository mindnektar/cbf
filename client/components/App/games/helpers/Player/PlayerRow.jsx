import React from 'react';
import PropTypes from 'prop-types';

class PlayerRow extends React.Component {
    render() {
        return (
            <div className="cbf-helper-player-row">
                {this.props.children}
            </div>
        );
    }
}

PlayerRow.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PlayerRow;
