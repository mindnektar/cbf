import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'molecules/Collapsible';

const FormError = (props) => (
    <Collapsible collapsed={!props.children}>
        <div className="cbf-ui-form-error">
            {props.children}
        </div>
    </Collapsible>
);

FormError.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormError;
