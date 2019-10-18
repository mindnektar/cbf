import React from 'react';
import PropTypes from 'prop-types';

const Option = (props) => (
    <div className="cbf-setup-option">
        <div className="cbf-setup-option__label">
            {props.label}
        </div>

        <div className="cbf-setup-option__inputs">
            {props.children}
        </div>
    </div>
);

Option.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Option;
