import React from 'react';
import connectWithRouter from 'helpers/connectWithRouter';
import AllGames from './Play/AllGames';

class Play extends React.Component {
    render() {
        return (
            <div>
                <AllGames />
            </div>
        );
    }
}

export default connectWithRouter(null, null, Play);
