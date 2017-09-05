import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {
    render() {
        return (
            <div
                className="cbf-ui-button"
                onTouchTap={this.props.onTouchTap}
            >
                {this.props.children}
            </div>
        );
    }
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    onTouchTap: PropTypes.func.isRequired,
};

export default Button;
