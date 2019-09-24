import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { actions, assets } from 'shared/games/five-tribes';
import Action from '../helpers/Action';

class TurnOrder extends React.Component {
    render() {
        const { turnOrder } = this.props.gameState.public.game;

        return (
            <div>
                {assets.turnOrderTrack.map((spot, spotIndex) => (
                    <Action
                        action={actions.SELECT_TURN_ORDER_SPOT}
                        // eslint-disable-next-line react/no-array-index-key
                        key={spotIndex}
                        params={[spotIndex]}
                    >
                        <div className="five-tribes__track-item">
                            <div className="five-tribes__track-number">
                                {spot}
                            </div>

                            {turnOrder[spotIndex] !== null && (
                                <div
                                    className={classNames(
                                        'five-tribes__track-player',
                                        `five-tribes__player-${turnOrder[spotIndex]}`
                                    )}
                                />
                            )}
                        </div>
                    </Action>
                ))}
            </div>
        );
    }
}

TurnOrder.propTypes = {
    gameState: PropTypes.object.isRequired,
};

export default TurnOrder;
