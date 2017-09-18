import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class Djinns extends React.Component {
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
                    <div
                        className="five-tribes__djinn-item"
                        key={djinn}
                    >
                        <div className="five-tribes__djinn-item-name">
                            {assets.djinns[djinn].name}
                        </div>

                        <div className="five-tribes__djinn-item-value">
                            {assets.djinns[djinn].value}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Djinns.propTypes = {
    gameState: PropTypes.object.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[
            (state.gameStates.stateCountSinceLastLoad - 1) + state.gameStates.actionIndex
        ],
    }),
    null,
    Djinns
);
