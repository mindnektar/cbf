import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Tabs = (props) => {
    const [activeTab, setActiveTab] = useState(0);

    const changeTabHandler = (index) => () => {
        setActiveTab(index);
    };

    return (
        <div
            className={classNames(
                'cbf-ui-tabs',
                { 'cbf-ui-tabs--dark': props.dark }
            )}
        >
            <div className="cbf-ui-tabs__bar">
                {props.tabs.map((label, index) => (
                    <div
                        className={classNames(
                            'cbf-ui-tabs__tab',
                            { 'cbf-ui-tabs__tab--active': index === activeTab }
                        )}
                        onClick={changeTabHandler(index)}
                        key={label}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="cbf-ui-tabs__content">
                {props.children[activeTab]}
            </div>
        </div>
    );
};

Tabs.defaultProps = {
    dark: false,
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
    dark: PropTypes.bool,
};

export default Tabs;
