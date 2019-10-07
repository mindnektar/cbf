import React from 'react';
import PropTypes from 'prop-types';

const Notification = (props) => props.count > 0 && (
    <span className="cbf-ui-notification">
        {props.count}
    </span>
);

Notification.propTypes = {
    count: PropTypes.number.isRequired,
};

export default Notification;
