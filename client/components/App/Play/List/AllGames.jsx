import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import ListModel from 'models/play/list';
import Headline from 'atoms/Headline';
import GameList from './GameList';

class AllGames extends React.Component {
    createMatch = async (match) => {
        const { data } = await this.props.createMatch({ handle: match.handle });

        this.props.history.push(`/play/${data.createMatch.id}`);
    }

    render() {
        return (
            <div className="cbf-all-games">
                <Headline>All games</Headline>

                <GameList
                    matches={Object.values(games).map((game) => ({
                        id: game.handle,
                        handle: game.handle,
                        game,
                    }))}
                    action={{ label: 'Start new game', handler: this.createMatch }}
                >
                    {({ game }) => (
                        <>
                            <div>{game.author}</div>

                            <div>
                                {game.playerCount[0]}
                                -
                                {game.playerCount[game.playerCount.length - 1]}
                                &nbsp;
                                players
                            </div>

                            <div>
                                {game.playTime}
                                &nbsp;
                                minutes
                            </div>
                        </>
                    )}
                </GameList>
            </div>
        );
    }
}

AllGames.propTypes = {
    createMatch: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(AllGames));
