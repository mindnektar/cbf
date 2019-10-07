import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
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
        <>
            <Headline>Active matches</Headline>

            <GameList
                matches={activeMatches}
                action={{ label: 'Open game', handler: openMatch }}
            >
                {(match) => (
                    match.players.map((player) => (
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
                    match.scores.sort((a, b) => b.values[0] - a.values[0]).map((score, index) => (
                        <div key={score.player.id}>
                            #
                            {index + 1}
                            :&nbsp;
                            {score.player.name}
                            &nbsp;
                            (
                            {score.values[0]}
                            &nbsp;points)
                        </div>
                    ))
                )}
            </GameList>
        </>
    );
};

MyMatches.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(MyMatches));
