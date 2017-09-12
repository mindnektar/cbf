import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';
import { actions, assets, transformers, validators } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class Hand extends React.Component {
    mayPlaceMeeple = meeple => (
        validators[actions.PLACE_MEEPLE](this.props.gameState, [meeple])
    )

    placeMeepleHandler = meeple => () => {
        this.props.updateGameState(
            this.props.gameId, actions.PLACE_MEEPLE, transformers, [meeple]
        );
    }

    render() {
        const hand = this.props.gameState[0][0][10];

        return (
            <div className="five-tribes__hand">
                {hand.map(meeple =>
                    <Action
                        active={this.mayPlaceMeeple(meeple)}
                        key={meeple}
                        onTouchTap={this.placeMeepleHandler(meeple)}
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
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.array.isRequired,
    updateGameState: PropTypes.func.isRequired,
};

export default connectWithRouter(
    (state, ownProps) => ({
        gameId: ownProps.match.params.gameId,
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    {
        updateGameState,
    },
    Hand
);
