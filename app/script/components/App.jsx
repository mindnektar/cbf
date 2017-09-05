import React from 'react';
import { Switch, Route } from 'react-router-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import Header from './App/Header';
import Home from './App/Home';
import Play from './App/Play';

class App extends React.Component {
    render() {
        return (
            <div>
                <Header />

                <div className="cbf-content">
                    <Switch>
                        <Route path="/play" component={Play} />
                        <Route path="/" component={Home} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default connectWithRouter(null, null, App);
