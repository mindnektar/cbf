import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import Collapsible from 'molecules/Collapsible';

let optionsStyle = {};

const Select = (props) => {
    const [opened, setOpened] = useState(false);
    const selectRef = useRef();

    const onChangeHandler = (value) => () => {
        props.onChange(value);
        close();
    };

    const close = () => {
        setOpened(false);
    };

    const toggle = () => {
        if (!opened) {
            const selectRect = selectRef.current.getBoundingClientRect();

            optionsStyle = {
                left: selectRect.left,
                top: selectRect.top + (selectRect.height / 2),
                width: selectRect.width,
                borderRadius: `0 0 ${selectRect.height / 2}px ${selectRect.height / 2}px`,
            };
        }

        setOpened(!opened);
    };

    const selectedOption = props.options.find((option) => option.value === props.value);

    return (
        <div
            className={classNames(
                'cbf-ui-select',
                { 'cbf-ui-select--opened': opened }
            )}
            ref={selectRef}
        >
            <OutsideClickHandler onOutsideClick={close}>
                <div
                    className="cbf-ui-select__current"
                    onClick={toggle}
                >
                    <div className="cbf-ui-select__label">
                        {selectedOption.label}
                    </div>
                </div>

                <div
                    className="cbf-ui-select__options-wrapper"
                    style={optionsStyle}
                >
                    <Collapsible collapsed={!opened}>
                        <div className="cbf-ui-select__options">
                            {
                                props.options
                                    .filter((option) => option !== selectedOption)
                                    .map((option) => (
                                        <div
                                            className="cbf-ui-select__option"
                                            key={option.value}
                                            onClick={onChangeHandler(option.value)}
                                        >
                                            <div className="cbf-ui-select__label">
                                                {option.label}
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </Collapsible>
                </div>
            </OutsideClickHandler>
        </div>
    );
};

Select.propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    })).isRequired,
    value: PropTypes.string.isRequired,
};

export default Select;
