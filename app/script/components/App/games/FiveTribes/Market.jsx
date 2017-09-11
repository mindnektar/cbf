import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class Market extends React.Component {
    render() {
        const resources = this.props.gameState[0][0][1];
        const remainingResources = this.props.gameState[0][0][2];

        return (
            <div className="five-tribes__market">
                <div className="five-tribes__market-item five-tribes__market-item--deck">
                    <div className="five-tribes__market-item-name">
                        {remainingResources} resource{remainingResources !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {resources.map(resource =>
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
    gameState: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    null,
    Market
);
