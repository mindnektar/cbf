import React from 'react';
import PropTypes from 'prop-types';
import ListModel from 'models/play/list';
import Notification from 'atoms/Notification';
import LoadingContainer from 'molecules/LoadingContainer';
import Tabs from 'molecules/Tabs';
import AllGames from './List/AllGames';
import MyMatches from './List/MyMatches';
import OpenInvitations from './List/OpenInvitations';

const List = (props) => {
    const renderContent = () => {
        let tabs = [{
            label: 'All games',
            Content: AllGames,
        }];

        if (props.data.me) {
            const myMatchCount = props.data.me.matches
                .filter(({ status }) => status !== 'FINISHED')
                .length;
            const openInvitations = props.data.matches.filter((match) => {
                const maxPlayerCount = match.options
                    .find(({ type }) => type === 'num-players')
                    .values
                    .reduce((result, current) => (
                        current > result ? current : result
                    ), 0);

                return (
                    !match.participants.some(({ player }) => player.id === props.data.me.id)
                    && match.participants.length < maxPlayerCount
                );
            });

            tabs = [
                {
                    label: (
                        <span>
                            My matches
                            <Notification count={myMatchCount} />
                        </span>
                    ),
                    Content: MyMatches,
                },
                {
                    label: (
                        <span>
                            Open invitations
                            <Notification count={openInvitations.length} />
                        </span>
                    ),
                    Content: OpenInvitations,
                    properties: { matches: openInvitations },
                },
                ...tabs,
            ];
        }

        return (
            <>
                <Tabs tabs={tabs.map(({ label }) => label)}>
                    {tabs.map(({ Content, properties = {} }, index) => (
                        <Content key={index} {...properties} />
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
