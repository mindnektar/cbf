import React from 'react';
import PropTypes from 'prop-types';

const TextArea = (props) => (
    <div className="cbf-ui-text-area">
        <textarea
            className="cbf-ui-text-area__input"
            onChange={props.onChange}
            value={props.children}
        />
    </div>
);

TextArea.propTypes = {
    children: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TextArea;
