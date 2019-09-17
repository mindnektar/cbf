import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Button extends React.Component {
    render() {
        return (
            <div
                className={classNames(
                    'cbf-ui-button',
                    {
                        'cbf-ui-button--disabled': this.props.disabled,
                        'cbf-ui-button--secondary': this.props.secondary,
                    }
                )}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </div>
        );
    }
}

Button.defaultProps = {
    disabled: false,
    secondary: false,
};

Button.propTypes = {
    children: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    secondary: PropTypes.bool,
};

export default Button;
