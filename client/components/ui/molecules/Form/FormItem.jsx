import React from 'react';
import PropTypes from 'prop-types';

const FormItem = (props) => (
    <div className="cbf-ui-form-item">
        {props.label && (
            <div className="cbf-ui-form-item__label">
                {props.label}
            </div>
        )}
        {props.children}
    </div>
);

FormItem.defaultProps = {
    label: null,
};

FormItem.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
};

export default FormItem;
