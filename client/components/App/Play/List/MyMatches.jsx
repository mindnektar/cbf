import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import determineRanks from 'helpers/determineRanks';
import games from 'data/games';
import ListModel from 'models/play/list';
import Headline from 'atoms/Headline';
import GameList from './GameList';

const MyMatches = (props) => {
    const activeMatches = props.data.me.matches.filter((match) => match.status !== 'FINISHED');
    const finishedMatches = props.data.me.matches.filter((match) => match.status === 'FINISHED');

    const openMatch = (match) => {
        props.history.push(`/play/${match.id}`);
    };

    return (
        <div className="cbf-my-matches">
            <Headline>Active matches</Headline>

            <GameList
                matches={activeMatches}
                action={{ label: 'Open game', handler: openMatch }}
            >
                {(match) => (
                    match.participants.map(({ player }) => (
                        <div key={player.id}>
                            {player.name}
                        </div>
                    ))
                )}
            </GameList>

            <Headline>Finished matches</Headline>

            <GameList
                matches={finishedMatches}
                action={{ label: 'Open game', handler: openMatch }}
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
