import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import Resource from './Resource';

class Market extends React.Component {
    render() {
        const remainingResourceCount = this.props.gameState.public.game.remainingResourceCount;

        return (
            <div className="five-tribes__market">
                <div className="five-tribes__resource five-tribes__resource--deck">
                    <div className="five-tribes__resource-name">
                        {remainingResourceCount} resource{remainingResourceCount !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {this.props.gameState.public.game.availableResources.map(resource =>
                    <Resource
                        resource={resource}
                        key={resource}
                    />
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
