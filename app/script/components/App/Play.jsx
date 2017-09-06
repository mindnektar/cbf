import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import connectWithRouter from 'helpers/connectWithRouter';
import AllGames from './Play/AllGames';
import MyGames from './Play/MyGames';
import OpenGames from './Play/OpenGames';
import Game from './Play/Game';

class Play extends React.Component {
    render() {
        return (
            <Switch>
                <Route path={`${this.props.url}/:gameId`} component={Game} />
                <Route path={this.props.url}>
                    <div>
                        {this.props.me &&
                            <MyGames />
                        }

                        {this.props.me &&
                            <OpenGames />
                        }

                        <AllGames />
                    </div>
                </Route>
            </Switch>
        );
    }
}

Play.defaultProps = {
    me: null,
};

Play.propTypes = {
    me: PropTypes.object,
    url: PropTypes.string.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        me: state.me,
        url: ownProps.match.url,
    }),
    null,
    Play
);
