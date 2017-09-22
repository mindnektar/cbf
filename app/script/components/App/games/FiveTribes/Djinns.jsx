import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGlobalGameParams } from 'actions/games';
import { actions, assets } from 'shared/games/five-tribes';
import LocalAction from '../helpers/LocalAction';

class Djinns extends React.Component {
    selectDjinnHandler = djinn => () => {
        this.props.updateGlobalGameParams({
            selectedDjinn: this.props.globalGameParams.selectedDjinn === djinn ? null : djinn,
        });
    }

    render() {
        const remainingDjinnCount = this.props.gameState.public.game.remainingDjinnCount;

        return (
            <div className="five-tribes__djinns">
                <div className="five-tribes__djinn-item five-tribes__djinn-item--deck">
                    <div className="five-tribes__djinn-item-name">
                        {remainingDjinnCount} djinn{remainingDjinnCount !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {this.props.gameState.public.game.availableDjinns.map(djinn =>
                    <LocalAction
                        active={actions.COLLECT_DJINN.isDjinnSelectable(
                            this.props.gameState, this.props.globalGameParams.selectedDjinn, djinn
                        )}
                        key={djinn}
                        onTouchTap={this.selectDjinnHandler(djinn)}
                        selected={this.props.globalGameParams.selectedDjinn === djinn}
                    >
                        <div className="five-tribes__djinn-item">
                            <div className="five-tribes__djinn-item-name">
                                {assets.djinns[djinn].name}
                            </div>

                            <div className="five-tribes__djinn-item-value">
                                {assets.djinns[djinn].value}
                            </div>
                        </div>
                    </LocalAction>
                )}
            </div>
        );
    }
}

Djinns.propTypes = {
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
    Djinns
);
