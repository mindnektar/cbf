import React from 'react';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import Collapsible from 'molecules/Collapsible';

const PlayerArea = (props) => (
    <div className="cbf-helper-player-area__data">
        <OutsideClickHandler onOutsideClick={props.close}>
            <Collapsible collapsed={!props.isOpen}>
                <div className="cbf-helper-player-area__data-content">
                    {props.data.map((item) => (
                        <div
                            className="cbf-helper-player-area__item"
                            key={item.label}
                        >
                            {item.label}
                            :&nbsp;
                            {item.value}
                        </div>
                    ))}
                </div>
            </Collapsible>
        </OutsideClickHandler>
    </div>
);

PlayerArea.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
};

export default PlayerArea;
