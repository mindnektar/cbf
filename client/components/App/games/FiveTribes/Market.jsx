import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGlobalGameParams } from 'actions/games';
import { actions, states } from 'shared/games/five-tribes';
import LocalAction from '../helpers/LocalAction';
import Resource from './Resource';

class Market extends React.Component {
    getAction() {
        if (this.props.gameState.state === states.GO_TO_BIG_MARKET.id) {
            return actions.GO_TO_BIG_MARKET;
        }

        return actions.GO_TO_SMALL_MARKET;
    }

    selectResourceHandler = resource => () => {
        const selectedResources = [...this.props.globalGameParams.selectedResources];
        const resourceIndex = selectedResources.indexOf(resource);

        if (resourceIndex >= 0) {
            selectedResources.splice(resourceIndex, 1);
        } else {
            selectedResources.push(resource);
        }

        this.props.updateGlobalGameParams({ selectedResources });
    }

    render() {
        const remainingResourceCount = this.props.gameState.public.game.remainingResourceCount;
        const { selectedResources } = this.props.globalGameParams;

        return (
            <div className="five-tribes__market">
                <div className="five-tribes__resource five-tribes__resource--deck">
                    <div className="five-tribes__resource-name">
                        {remainingResourceCount} resource{remainingResourceCount !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {this.props.gameState.public.game.availableResources.map((resource, index) =>
                    <LocalAction
                        active={this.getAction().isSelectable(
                            this.props.gameState, selectedResources, index
                        )}
                        key={resource}
                        onTouchTap={this.selectResourceHandler(index)}
                        selected={selectedResources && selectedResources.includes(index)}
                    >
                        <Resource resource={resource} />
                    </LocalAction>
                )}
            </div>
        );
    }
}

Market.propTypes = {
    gameState: PropTypes.object.isRequired,
    globalGameParams: PropTypes.object.isRequired,
    updateGlobalGameParams: PropTypes.func.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.currentState],
        globalGameParams: state.gameStates.globalGameParams,
    }),
    {
        updateGlobalGameParams,
    },
    Market
);
