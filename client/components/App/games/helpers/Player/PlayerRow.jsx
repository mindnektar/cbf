import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';

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

export default connectWithRouter(
    null,
    null,
    PlayerRow
);
