import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ImageValue = (props) => (
    <div
        className={classNames(
            'cbf-setup-image-value',
            { 'cbf-setup-image-value--selected': props.selected }
        )}
        onClick={props.onChange}
    >
        <div className="cbf-setup-image-value__image">
            <img src={props.image} alt={props.label} />
        </div>

        <div className="cbf-setup-image-value__label">
            {props.label}
        </div>
    </div>
);

ImageValue.propTypes = {
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ImageValue;
