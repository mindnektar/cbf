import React from 'react';
import PropTypes from 'prop-types';
import ListModel from 'models/play/list';
import LoadingContainer from 'molecules/LoadingContainer';
import Tabs from 'molecules/Tabs';
import AllGames from './List/AllGames';
import MyMatches from './List/MyMatches';
import OpenInvitations from './List/OpenInvitations';

const List = (props) => {
    const renderContent = () => {
        let tabs = { 'All games': AllGames };

        if (props.data.me) {
            tabs = {
                'My matches': MyMatches,
                'Open invitations': OpenInvitations,
                ...tabs,
            };
        }

        return (
            <>
                <Tabs tabs={Object.keys(tabs)}>
                    {Object.values(tabs).map((TabContent, index) => (
                        <TabContent key={index} />
                    ))}
                </Tabs>
            </>
        );
    };

    return (
        <LoadingContainer>
            {!props.data.loading && renderContent()}
        </LoadingContainer>
    );
};

List.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ListModel.graphql(List);
