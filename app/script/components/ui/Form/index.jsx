import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
    render() {
        return (
            <div className="cbf-ui-form">
                {this.props.children}
            </div>
        );
    }
}

Form.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Form;
export { default as FormItem } from './FormItem';
