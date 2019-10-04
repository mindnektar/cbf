import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Game from './Play/Game';
import List from './Play/List';

const Play = () => (
    <Switch>
        <Route path="/play/:gameId" component={Game} />
        <Route path="/play" component={List} />
    </Switch>
);

export default Play;
