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
            />
        </div>
    );
};

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
