import React from 'react';
import PropTypes from 'prop-types';
import Tabs from 'molecules/Tabs';
import History from './Sidebar/History';
import Chat from './Sidebar/Chat';

const Sidebar = (props) => (
    <div
        className="cbf-sidebar"
        onMouseDown={(event) => event.stopPropagation()}
    >
        <Tabs
            tabs={['Turn history', 'Chat']}
            dark
        >
            <History
                isGameFinished={props.isGameFinished}
                players={props.players}
            />

            <Chat />
        </Tabs>
    </div>
);

Sidebar.propTypes = {
    isGameFinished: PropTypes.bool.isRequired,
    players: PropTypes.array.isRequired,
};

export default Sidebar;
