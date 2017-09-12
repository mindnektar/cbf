import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class Market extends React.Component {
    render() {
        const remainingResourceCount = this.props.gameState.public.game.remainingResourceCount;

        return (
            <div className="five-tribes__market">
                <div className="five-tribes__market-item five-tribes__market-item--deck">
                    <div className="five-tribes__market-item-name">
                        {remainingResourceCount} resource{remainingResourceCount !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {this.props.gameState.public.game.availableResources.map(resource =>
                    <div
                        className={classNames(
                            'five-tribes__market-item',
                            { 'five-tribes__market-item--fakir': assets.resources[resource] === 'Fakir' }
                        )}
                        key={resource}
                    >
                        <div className="five-tribes__market-item-name">
                            {assets.resources[resource]}
                        </div>

                        <div className="five-tribes__market-item-frequency">
                            {assets.resources.filter(
                                name => name === assets.resources[resource]
                            ).length}x
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Market.propTypes = {
    gameState: PropTypes.object.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    null,
    Market
);
