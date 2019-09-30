import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = (props) => (
    <label className="cbf-ui-checkbox">
        <input
            className="cbf-ui-checkbox__input"
            checked={props.checked}
            onChange={props.onChange}
            type="checkbox"
        />

        <span className="cbf-ui-checkbox__box">
            &#x2714;
        </span>

        {props.children && (
            <span className="ui-checkbox__label">
                {props.children}
            </span>
        )}
    </label>
);

Checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Checkbox;
