import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import ListModel from 'models/play/list';
import Collapsible from 'molecules/Collapsible';
import Headline from 'atoms/Headline';
import GameList from './GameList';

const OpenInvitations = (props) => {
    const myInvitations = props.data.me.matches.filter((match) => {
        const participant = match.participants.find(({ player }) => player.id === props.data.me.id);

        return match.status === 'OPEN' && participant && !participant.confirmed;
    });
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

    const joinMatch = async (match) => {
        await props.joinMatch(match.id);

        props.history.push(`/play/${match.id}`);
    };

    const confirmInvitation = (match) => {
        props.confirmInvitation(match.id);
    };

    const declineInvitation = (match) => {
        props.declineInvitation(match.id);
    };

    return (
        <div className="cbf-invitations">
            <TransitionGroup component={React.Fragment}>
                {myInvitations.length > 0 && (
                    <Transition
                        mountOnEnter
                        timeout={300}
                        unmountOnExit
                    >
                        {(transitionState) => (
                            <Collapsible collapsed={transitionState !== 'entered'}>
                                <Headline>My invitations</Headline>
                            </Collapsible>
                        )}
                    </Transition>
                )}
            </TransitionGroup>

            <GameList
                matches={myInvitations}
                actions={[
                    { label: 'Accept', handler: confirmInvitation },
                    { label: 'Decline', handler: declineInvitation },
                ]}
            >
                {(match) => (
                    match.participants.map(({ player }) => (
                        <div key={player.id}>
                            {player.name}
                        </div>
                    ))
                )}
            </GameList>

            <TransitionGroup component={React.Fragment}>
                {openInvitations.length > 0 && (
                    <Transition
                        mountOnEnter
                        timeout={300}
                        unmountOnExit
                    >
                        {(transitionState) => (
                            <Collapsible collapsed={transitionState !== 'entered'}>
                                <Headline>Open invitations</Headline>
                            </Collapsible>
                        )}
                    </Transition>
                )}
            </TransitionGroup>

            <GameList
                matches={openInvitations}
                actions={[{ label: 'Join game', handler: joinMatch }]}
            >
                {(match) => (
                    match.participants.map(({ player }) => (
                        <div key={player.id}>
                            {player.name}
                        </div>
                    ))
                )}
            </GameList>
        </div>
    );
};

OpenInvitations.propTypes = {
    data: PropTypes.object.isRequired,
    joinMatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmInvitation: PropTypes.func.isRequired,
    declineInvitation: PropTypes.func.isRequired,
};

export default withRouter(ListModel.graphql(OpenInvitations));
