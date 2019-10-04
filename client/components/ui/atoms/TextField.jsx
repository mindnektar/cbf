import React from 'react';
import PropTypes from 'prop-types';

const TextField = (props) => {
    const onKeyPress = (event) => {
        if (event.which === 13) {
            props.onSubmit(event);
        }
    };

    return (
        <div className="cbf-ui-text-field">
            <input
                onChange={props.onChange}
                onKeyPress={onKeyPress}
                type={props.type}
                value={props.children}
                maxLength={props.maxLength}
            />
        </div>
    );
};

TextField.defaultProps = {
    onSubmit: () => null,
    type: 'text',
    maxLength: null,
};

TextField.propTypes = {
    children: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    type: PropTypes.string,
    maxLength: PropTypes.number,
};

export default TextField;
