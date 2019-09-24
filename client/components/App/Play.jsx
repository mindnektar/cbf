import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import AllGames from './Play/AllGames';
import MyGames from './Play/MyGames';
import OpenGames from './Play/OpenGames';
import FinishedGames from './Play/FinishedGames';
import Game from './Play/Game';

const Play = (props) => (
    <Switch>
        <Route path={`${props.url}/:gameId`} component={Game} />
        <Route path={props.url}>
            <div>
                {props.me && (
                    <>
                        <MyGames />
                        <OpenGames />
                        <AllGames />
                        <FinishedGames />
                    </>
                )}
            </div>
        </Route>
    </Switch>
);

Play.defaultProps = {
    me: null,
};

Play.propTypes = {
    me: PropTypes.object,
    url: PropTypes.string.isRequired,
};

export default Play;
