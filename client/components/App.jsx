import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './App/Header';
import Home from './App/Home';
import Login from './App/Login';
import Play from './App/Play';

const App = () => (
    <>
        <Header />

        <div className="cbf-content">
            <Switch>
                <Route path="/play" component={Play} />
                <Route path="/login" component={Login} />
                <Route path="/" component={Home} />
            </Switch>
        </div>
    </>
);

export default App;
