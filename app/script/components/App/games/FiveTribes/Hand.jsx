import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { actions, assets, transformers, validators } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class Hand extends React.Component {
    render() {
        const hand = this.props.gameState[0][0][10];

        return (
            <div className="five-tribes__hand">
                {hand.map(meeple =>
                    <Action
                        action={actions.PLACE_MEEPLE}
                        key={meeple}
                        params={[meeple]}
                        transformers={transformers}
                        validators={validators}
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
    gameState: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    null,
    Hand
);
