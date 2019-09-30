import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'atoms/Checkbox';

const Option = (props) => (
    <div className="cbf-setup-option">
        <div className="cbf-setup-option__label">
            {props.label}
        </div>

        <div className="cbf-setup-option__inputs">
            {props.possibleValues.map((value) => (
                <Checkbox
                    checked={props.values.includes(value)}
                    onChange={props.onChangeHandler(value)}
                    key={value}
                >
                    {props.possibleValues.length >= 2 ? value : null}
                </Checkbox>
            ))}
        </div>
    </div>
);

Option.propTypes = {
    label: PropTypes.string.isRequired,
    possibleValues: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    onChangeHandler: PropTypes.func.isRequired,
};

export default Option;
