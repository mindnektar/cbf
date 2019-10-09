import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import Notification from 'atoms/Notification';
import Tabs from 'molecules/Tabs';
import History from './Sidebar/History';
import Chat from './Sidebar/Chat';

const Sidebar = (props) => {
    const [renderedUnreadMessageCount, setRenderedUnreadMessageCount] = useState(0);
    const { lastReadMessage } = props.data.match.participants.find(({ player }) => (
        player.id === props.data.me.id
    ));
    const unreadMessageCount = lastReadMessage
        ? props.data.match.messages.findIndex(({ id }) => (
            id === lastReadMessage.id
        ))
        : props.data.match.messages.length;

    useEffect(() => {
        if (unreadMessageCount === 0) {
            setRenderedUnreadMessageCount(0);
        } else {
            // Have a slight delay before showing the notification to avoid having it show when the
            // chat is already open
            window.setTimeout(() => {
                setRenderedUnreadMessageCount(unreadMessageCount);
            }, 100);
        }
    }, [unreadMessageCount]);

    return (
        <div
            className="cbf-sidebar"
            onMouseDown={(event) => event.stopPropagation()}
        >
            <Tabs
                tabs={[
                    'Turn history',
                    (
                        <span>
                            Chat
                            <Notification count={renderedUnreadMessageCount} />
                        </span>
                    ),
                ]}
                dark
            >
                <History
                    isGameFinished={props.isGameFinished}
                    participants={props.participants}
                />

                <Chat />
            </Tabs>
        </div>
    );
};

Sidebar.propTypes = {
    isGameFinished: PropTypes.bool.isRequired,
    participants: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Sidebar));
