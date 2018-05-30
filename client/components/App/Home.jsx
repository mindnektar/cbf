import React from 'react';
import connectWithRouter from 'helpers/connectWithRouter';

class Home extends React.Component {
    render() {
        return (
            <div>
                Home
            </div>
        );
    }
}

export default connectWithRouter(null, null, Home);
