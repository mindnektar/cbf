import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ListModel from 'models/play/list';
import Headline from 'atoms/Headline';
import GameList from './GameList';

class MyGames extends React.Component {
    getMatches() {
        return this.props.data.me.matches.filter((match) => match.status !== 'FINISHED');
    }

    openGame = (match) => {
        this.props.history.push(`/play/${match.id}`);
    }

    render() {
        return (
            <div className="cbf-my-games">
                <Headline>My active games</Headline>

                <GameList
                    matches={this.getMatches()}
                    action={{ label: 'Open game', handler: this.openGame }}
                >
                    {(match) => (
                        match.players.map((player) => (
                            <div key={player.id}>
                                {player.name}
                            </div>
                        ))
                    )}
                </GameList>
            </div>
        );
    }
}

MyGames.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ListModel.graphql(MyGames));
