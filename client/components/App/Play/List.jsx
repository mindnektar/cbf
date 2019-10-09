import React from 'react';
import PropTypes from 'prop-types';
import ListModel from 'models/play/list';
import Notification from 'atoms/Notification';
import LoadingContainer from 'molecules/LoadingContainer';
import Tabs from 'molecules/Tabs';
import AllGames from './List/AllGames';
import MyMatches from './List/MyMatches';
import Invitations from './List/Invitations';

const List = (props) => {
    const renderContent = () => {
        let tabs = [{
            label: 'All games',
            Content: AllGames,
        }];

        if (props.data.me) {
            const myMatchCount = props.data.me.matches
                .filter((match) => {
                    const participant = match.participants.find(({ player }) => (
                        player.id === props.data.me.id
                    ));

                    return (
                        match.status !== 'FINISHED'
                        && participant
                        && participant.confirmed
                        && participant.awaitsAction
                    );
                })
                .length;
            const myInvitationCount = props.data.me.matches
                .filter((match) => {
                    const participant = match.participants.find(({ player }) => (
                        player.id === props.data.me.id
                    ));

                    return match.status === 'OPEN' && participant && !participant.confirmed;
                })
                .length;

            tabs = [
                {
                    label: (
                        <>
                            My matches
                            <Notification count={myMatchCount} />
                        </>
                    ),
                    Content: MyMatches,
                },
                {
                    label: (
                        <>
                            Invitations
                            <Notification count={myInvitationCount} />
                        </>
                    ),
                    Content: Invitations,
                },
                ...tabs,
            ];
        }

        return (
            <>
                <Tabs tabs={tabs.map(({ label }) => label)}>
                    {tabs.map(({ Content }, index) => (
                        <Content key={index} />
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
