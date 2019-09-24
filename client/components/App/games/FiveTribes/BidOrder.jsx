import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { states } from 'shared/games/five-tribes';

class BidOrder extends React.Component {
    getBidOrder() {
        let { state } = this.props.gameState;

        if (state === states.END_TURN.id) {
            [state] = this.props.gameState.action;
        }

        return state === states.BID_FOR_TURN_ORDER.id
            ? this.props.gameState.public.game.bidOrder
            : this.props.gameState.public.game.nextTurnsBidOrder;
    }

    render() {
        const bidOrder = this.getBidOrder();

        return (
            <div>
                {[4, 3, 2, 1].map((spot, spotIndex) => (
                    <div className="five-tribes__track-item" key={spot}>
                        <div className="five-tribes__track-number">
                            {spot}
                        </div>

                        {
                            bidOrder.length > spotIndex
                            && bidOrder[spotIndex] !== null
                            && (
                                <div
                                    className={classNames(
                                        'five-tribes__track-player',
                                        `five-tribes__player-${bidOrder[spotIndex]}`
                                    )}
                                />
                            )
                        }
                    </div>
                ))}
            </div>
        );
    }
}

BidOrder.propTypes = {
    gameState: PropTypes.object.isRequired,
};

export default BidOrder;
