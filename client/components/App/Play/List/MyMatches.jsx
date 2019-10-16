import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import moment from 'moment';
import determineRanks from 'helpers/determineRanks';
import games from 'data/games';
import ListModel from 'models/play/list';
import Collapsible from 'molecules/Collapsible';
import Headline from 'atoms/Headline';
import Button from 'atoms/Button';
import GameList from './GameList';

const MyMatches = (props) => {
    const activeMatches = props.data.me.matches
        .filter((match) => {
            const participant = match.participants.find(({ player }) => (
                player.id === props.data.me.id
            ));

            return match.status !== 'FINISHED' && participant && participant.confirmed;
        })
        .sort((a, b) => {
            const aParticipant = a.participants.find(({ player }) => (
                player.id === props.data.me.id
            ));
            const bParticipant = b.participants.find(({ player }) => (
                player.id === props.data.me.id
            ));

            return (
                (a.status === 'OPEN') - (b.status === 'OPEN')
                || bParticipant.awaitsAction - aParticipant.awaitsAction
                || moment(aParticipant.updatedAt).diff(bParticipant.updatedAt)
            );
        });
    const finishedMatches = props.data.me.matches
        .filter((match) => match.status === 'FINISHED')
        .sort((a, b) => moment(b.finishedAt).diff(a.finishedAt));

    const openMatch = (match) => {
        props.history.push(`/play/${match.id}`);
    };

    const goToNextMatch = () => {
        props.history.push(`/play/${activeMatches[0].id}`);
    };

    return (
        <div className="cbf-my-matches">
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

            {
                activeMatches.length > 0
                && activeMatches[0].participants.find(({ player }) => (
                    player.id === props.data.me.id
                )).awaitsAction
                && (
                    <div className="cbf-my-matches__go-to-next">
                        <Button onClick={goToNextMatch}>
                            Go to my next match!
                        </Button>
                    </div>
                )
            }

            <GameList
                matches={activeMatches}
                actions={[{ label: 'Open game', handler: openMatch }]}
                highlightItem={(match) => (
                    match.participants
                        .find(({ player }) => player.id === props.data.me.id)
                        .awaitsAction
                )}
                renderDate={(match) => moment(match.createdAt).format('L')}
            >
                {(match) => (
                    match.participants.map((participant) => (
                        <div
                            className={classNames(
                                'cbf-my-matches__player',
                                { 'cbf-my-matches__player--active': participant.awaitsAction }
                            )}
                            key={participant.player.id}
                        >
                            {participant.player.name}
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
                renderDate={(match) => moment(match.finishedAt).format('L')}
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
};

export default withRouter(ListModel.graphql(MyMatches));
