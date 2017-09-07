import React from 'react';
import PropTypes from 'prop-types';

class Status extends React.Component {
    render() {
        return (
            <div className="cbf-helper-status">
                {this.props.children}
            </div>
        );
    }
}

Status.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Status;
