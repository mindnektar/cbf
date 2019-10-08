import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import determineRanks from 'helpers/determineRanks';
import games from 'data/games';
import ListModel from 'models/play/list';
import Collapsible from 'molecules/Collapsible';
import Headline from 'atoms/Headline';
import GameList from './GameList';

const MyMatches = (props) => {
    const invitations = props.data.me.matches.filter((match) => {
        const participant = match.participants.find(({ player }) => player.id === props.data.me.id);

        return match.status === 'OPEN' && participant && !participant.confirmed;
    });
    const activeMatches = props.data.me.matches.filter((match) => {
        const participant = match.participants.find(({ player }) => player.id === props.data.me.id);

        return match.status !== 'FINISHED' && participant && participant.confirmed;
    });
    const finishedMatches = props.data.me.matches.filter((match) => match.status === 'FINISHED');

    const openMatch = (match) => {
        props.history.push(`/play/${match.id}`);
    };

    const confirmInvitation = (match) => {
        props.confirmInvitation(match.id);
    };

    const declineInvitation = (match) => {
        props.declineInvitation(match.id);
    };

    return (
        <div className="cbf-my-matches">
            <TransitionGroup component={React.Fragment}>
                {invitations.length > 0 && (
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
                matches={invitations}
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
                {activeMatches.length > 0 && (
                    <Transition
                        mountOnEnter
                        timeout={300}
                        unmountOnExit
                    >
                        {(transitionState) => (
                            <Collapsible collapsed={transitionState !== 'entered'}>
                                <Headline>Active matches</Headline>
                            </Collapsible>
                        )}
                    </Transition>
                )}
            </TransitionGroup>

            <GameList
                matches={activeMatches}
                actions={[{ label: 'Open game', handler: openMatch }]}
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
                {finishedMatches.length > 0 && (
                    <Transition
                        mountOnEnter
                        timeout={300}
                        unmountOnExit
                    >
                        {(transitionState) => (
                            <Collapsible collapsed={transitionState !== 'entered'}>
                                <Headline>Finished matches</Headline>
                            </Collapsible>
                        )}
                    </Transition>
                )}
            </TransitionGroup>

            <GameList
                matches={finishedMatches}
                actions={[{ label: 'Open game', handler: openMatch }]}
                small
            >
                {(match) => (
                    determineRanks(match.participants).map(({ player, rank, scores }) => (
                        <div key={player.id}>
                            <div
                                className={classNames(
                                    'cbf-my-matches__finished-name',
                                    { 'cbf-my-matches__finished-name--winner': rank === 1 }
                                )}
                            >
                                #
                                {rank}
                                :&nbsp;
                                {player.name}
                            </div>

                            <div className="cbf-my-matches__finished-score">
                                (
                                {games[match.handle].actions.END_GAME.formatScores(scores)}
                                )
                            </div>
                        </div>
                    ))
                )}
            </GameList>
        </div>
    );
};

MyMatches.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    confirmInvitation: PropTypes.func.isRequired,
    declineInvitation: PropTypes.func.isRequired,
};

export default withRouter(ListModel.graphql(MyMatches));
