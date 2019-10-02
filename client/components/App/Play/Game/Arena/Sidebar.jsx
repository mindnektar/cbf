import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import History from './Sidebar/History';
import Chat from './Sidebar/Chat';

const Sidebar = (props) => {
    const tabs = ['Turn history', 'Chat'];
    const [activeTab, setActiveTab] = useState('Turn history');

    const changeTabHandler = (tab) => () => {
        setActiveTab(tab);
    };

    return (
        <div
            className="cbf-sidebar"
            onMouseDown={(event) => event.stopPropagation()}
        >
            <div className="cbf-sidebar__tabs">
                {tabs.map((tab) => (
                    <div
                        className={classNames(
                            'cbf-sidebar__tab',
                            { 'cbf-sidebar__tab--active': tab === activeTab }
                        )}
                        onClick={changeTabHandler(tab)}
                        key={tab}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {activeTab === 'Turn history' && (
                <History
                    isGameFinished={props.isGameFinished}
                    players={props.players}
                />
            )}

            {activeTab === 'Chat' && (
                <Chat />
            )}
        </div>
    );
};

Sidebar.propTypes = {
    isGameFinished: PropTypes.bool.isRequired,
    players: PropTypes.array.isRequired,
};

export default Sidebar;
