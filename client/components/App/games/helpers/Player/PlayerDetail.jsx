import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';

class PlayerDetail extends React.Component {
    render() {
        return (
            <div className="cbf-helper-player-detail">
                <div className="cbf-helper-player-detail__header">
                    {this.props.header}
                </div>

                {this.props.children}
            </div>
        );
    }
}

PlayerDetail.propTypes = {
    children: PropTypes.node.isRequired,
    header: PropTypes.string.isRequired,
};

export default connectWithRouter(
    null,
    null,
    PlayerDetail
);
