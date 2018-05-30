import React from 'react';
import PropTypes from 'prop-types';

class TextField extends React.Component {
    onKeyPress = (event) => {
        if (event.which === 13) {
            this.props.onSubmit(event);
        }
    }

    render() {
        return (
            <div className="cbf-ui-text-field">
                <input
                    onChange={this.props.onChange}
                    onKeyPress={this.onKeyPress}
                    type={this.props.type}
                    value={this.props.children}
                />
            </div>
        );
    }
}

TextField.defaultProps = {
    onSubmit: () => null,
    type: 'text',
};

TextField.propTypes = {
    children: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    type: PropTypes.string,
};

export default TextField;
