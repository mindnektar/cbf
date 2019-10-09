import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import HomeModel from 'models/home';
import Headline from 'atoms/Headline';
import Button from 'atoms/Button';
import LoadingContainer from 'molecules/LoadingContainer';
import AnnouncementEditor from './Home/AnnouncementEditor';

const Home = (props) => {
    const [announcementEditorState, setAnnouncementEditorState] = useState({
        isOpen: false,
        id: null,
    });
    const sortedAnnouncements = [...props.data.announcements].sort((a, b) => (
        moment(b.createdAt).diff(a.createdAt)
    ));

    const openAnnouncementEditorHandler = (id = null) => () => {
        setAnnouncementEditorState({
            isOpen: true,
            id,
        });
    };

    const closeAnnouncementEditor = () => {
        setAnnouncementEditorState({
            isOpen: false,
            id: null,
        });
    };

    const renderContent = () => (
        <div className="cbf-home">
            <Headline>Welcome to Cardboard Frenzy!</Headline>

            {props.data.me.isAdmin && (
                <>
                    <div className="cbf-home__announcement-button">
                        <Button onClick={openAnnouncementEditorHandler()}>
                            Create announcement
                        </Button>
                    </div>

                    <AnnouncementEditor
                        isOpen={announcementEditorState.isOpen}
                        close={closeAnnouncementEditor}
                        id={announcementEditorState.id}
                    />
                </>
            )}

            <div className="cbf-home__announcements">
                {sortedAnnouncements.map((announcement) => (
                    <div
                        className="cbf-home__announcement"
                        key={announcement.id}
                    >
                        <div className="cbf-home__announcement-title">
                            {announcement.title}
                        </div>

                        <div className="cbf-home__announcement-text">
                            {announcement.text}
                        </div>

                        {props.data.me.isAdmin && (
                            <div className="cbf-home__announcement-button">
                                <Button onClick={openAnnouncementEditorHandler(announcement.id)}>
                                    Edit
                                </Button>
                            </div>
                        )}

                        <div className="cbf-home__announcement-footer">
                            <div className="cbf-home__announcement-author">
                                {announcement.author.name}
                            </div>

                            <div className="cbf-home__announcement-date">
                                {moment(announcement.createdAt).format('LLL')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <LoadingContainer>
            {!props.data.loading && renderContent()}
        </LoadingContainer>
    );
};

HomeModel.propTypes = {
    data: PropTypes.object.isRequired,
};

export default HomeModel.graphql(Home);
