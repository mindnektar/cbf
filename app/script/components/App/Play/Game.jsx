import React from 'react';
import connectWithRouter from 'helpers/connectWithRouter';

class Game extends React.Component {
    render() {
        return (
            <div>
                Game
            </div>
        );
    }
}

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
    }),
    null,
    Game
);
