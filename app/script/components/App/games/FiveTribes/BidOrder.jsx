import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { states } from 'shared/games/five-tribes';

class BidOrder extends React.Component {
    render() {
        const currentBidOrder = this.props.gameState[2] === states.BID_FOR_TURN_ORDER ?
            this.props.gameState[0][0][7] :
            this.props.gameState[0][0][9];

        return (
            <div>
                {[4, 3, 2, 1].map((spot, spotIndex) =>
                    <div className="five-tribes__track-item" key={spot}>
                        <div className="five-tribes__track-number">
                            {spot}
                        </div>

                        {
                            currentBidOrder.length > spotIndex &&
                            currentBidOrder[spotIndex] !== null &&
                            <div
                                className={classNames(
                                    'five-tribes__track-player',
                                    `five-tribes__track-player-${currentBidOrder[spotIndex]}`
                                )}
                            />
                        }
                    </div>
                )}
            </div>
        );
    }
}

BidOrder.propTypes = {
    gameState: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    null,
    BidOrder
);
