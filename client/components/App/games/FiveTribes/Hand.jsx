import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { actions, assets } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class Hand extends React.Component {
    render() {
        return (
            <div className="five-tribes__hand">
                {this.props.gameState.public.game.meeplesInHand.map(meeple =>
                    <Action
                        action={actions.PLACE_MEEPLE}
                        key={meeple}
                        params={[meeple]}
                    >
                        <div
                            className={classNames(
                                'five-tribes__meeple',
                                `five-tribes__meeple--${assets.meeples[meeple]}`
                            )}
                        />
                    </Action>
                )}
            </div>
        );
    }
}

Hand.propTypes = {
    gameState: PropTypes.object.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.currentState],
    }),
    null,
    Hand
);
