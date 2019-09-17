import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { updateGlobalGameParams } from 'actions/games';
import { actions } from 'shared/games/five-tribes';
import LocalAction from '../helpers/LocalAction';
import Djinn from './Djinn';

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
                <div className="five-tribes__djinn five-tribes__djinn--deck">
                    <div className="five-tribes__djinn-name">
                        {remainingDjinnCount} djinn{remainingDjinnCount !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {this.props.gameState.public.game.availableDjinns.map(djinn =>
                    <LocalAction
                        active={actions.COLLECT_DJINN.isDjinnSelectable(
                            this.props.gameState, this.props.globalGameParams.selectedDjinn, djinn
                        )}
                        key={djinn}
                        onClick={this.selectDjinnHandler(djinn)}
                        selected={this.props.globalGameParams.selectedDjinn === djinn}
                    >
                        <Djinn djinn={djinn} />
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
