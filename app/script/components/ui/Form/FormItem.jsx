import React from 'react';
import PropTypes from 'prop-types';

class FormItem extends React.Component {
    render() {
        return (
            <div className="cbf-ui-form-item">
                {this.props.children}
            </div>
        );
    }
}

FormItem.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormItem;
