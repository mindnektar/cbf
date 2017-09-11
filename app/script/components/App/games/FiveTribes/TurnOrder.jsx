import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGameState } from 'actions/games';
import { actions, assets, transformers, validators } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class TurnOrder extends React.Component {
    maySelectTurnOrderSpot = spotIndex => (
        validators[actions.SELECT_TURN_ORDER_SPOT](this.props.gameState, [spotIndex])
    )

    selectTurnOrderSpotHandler = spotIndex => () => {
        this.props.updateGameState(
            this.props.gameId, actions.SELECT_TURN_ORDER_SPOT, transformers, [spotIndex]
        );
    }

    render() {
        const turnOrder = this.props.gameState[0][0][8];

        return (
            <div>
                {assets.turnOrderTrack.map((spot, spotIndex) =>
                    <Action
                        active={this.maySelectTurnOrderSpot(spotIndex)}
                        // eslint-disable-next-line react/no-array-index-key
                        key={spotIndex}
                        onTouchTap={this.selectTurnOrderSpotHandler(spotIndex)}
                    >
                        <div className="five-tribes__track-item">
                            <div className="five-tribes__track-number">
                                {spot}
                            </div>

                            {turnOrder[spotIndex] !== null &&
                                <div
                                    className={classNames(
                                        'five-tribes__track-player',
                                        `five-tribes__track-player-${turnOrder[spotIndex]}`
                                    )}
                                />
                            }
                        </div>
                    </Action>
                )}
            </div>
        );
    }
}

TurnOrder.propTypes = {
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
    TurnOrder
);
