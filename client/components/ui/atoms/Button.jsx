import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = (props) => (
    <div
        className={classNames(
            'cbf-ui-button',
            {
                'cbf-ui-button--disabled': props.disabled,
                'cbf-ui-button--secondary': props.secondary,
            }
        )}
        onClick={props.onClick}
    >
        {props.children}
    </div>
);

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
