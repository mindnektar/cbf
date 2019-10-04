import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Data from './PlayerArea/Data';

const PlayerArea = (props) => {
    const [isDataOpen, setIsDataOpen] = useState(false);

    const openData = () => {
        setIsDataOpen(true);
    };

    const closeData = () => {
        setIsDataOpen(false);
    };

    return (
        <div
            className={classNames(
                'cbf-helper-player-area',
                `cbf-helper-player-area--player-count-${props.playerCount}`,
                `cbf-helper-player-area--player-${props.index}`
            )}
        >
            <div
                className="cbf-helper-player-area__name"
                onClick={openData}
                style={{ color: props.color }}
            >
                {props.name}
            </div>

            {props.data && (
                <Data
                    isOpen={isDataOpen}
                    close={closeData}
                    data={props.data}
                />
            )}

            <div className="cbf-helper-player-area__content">
                {props.children}
            </div>
        </div>
    );
};

PlayerArea.defaultProps = {
    color: null,
    children: null,
    data: [],
};

PlayerArea.propTypes = {
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    playerCount: PropTypes.number.isRequired,
    color: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })),
    children: PropTypes.node,
};

export default PlayerArea;
