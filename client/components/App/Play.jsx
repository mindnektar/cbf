import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import PlayModel from 'models/play';
import AllGames from './Play/AllGames';
import MyGames from './Play/MyGames';
import OpenGames from './Play/OpenGames';
import FinishedGames from './Play/FinishedGames';
import Game from './Play/Game';

const Play = (props) => (
    <Switch>
        <Route path="/play/:gameId" component={Game} />
        <Route path="/play">
            <div>
                {props.data.me && (
                    <>
                        <MyGames />
                        <OpenGames />
                    </>
                )}

                <AllGames />
            </div>
        </Route>
    </Switch>
);

Play.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default PlayModel.graphql(withRouter(Play));
