import React from 'react';
import PropTypes from 'prop-types';
import connectWithRouter from 'helpers/connectWithRouter';
import { assets } from 'shared/games/five-tribes';

class Djinns extends React.Component {
    render() {
        const djinns = this.props.gameState[0][0][3];
        const remainingDjinns = this.props.gameState[0][0][4];

        return (
            <div className="five-tribes__djinns">
                <div className="five-tribes__djinn-item five-tribes__djinn-item--deck">
                    <div className="five-tribes__djinn-item-name">
                        {remainingDjinns} djinn{remainingDjinns !== 1 ? 's' : ''} remaining
                    </div>
                </div>

                {djinns.map(djinn =>
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
    gameState: PropTypes.array.isRequired,
};

export default connectWithRouter(
    state => ({
        gameState: state.gameStates.states[state.gameStates.states.length - 1],
    }),
    null,
    Djinns
);
