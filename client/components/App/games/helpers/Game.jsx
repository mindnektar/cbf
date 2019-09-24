import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Game extends React.Component {
    componentDidMount() {
        this.checkAutomaticActions();
    }

    componentDidUpdate() {
        this.checkAutomaticActions();
    }

    checkAutomaticActions() {
        if (!this.props.isLatestState || !this.props.isGameActive) {
            return;
        }

        const {
            performAutomatically,
            performOnConfirm,
            params,
        } = this.props.states.findById(this.props.gameState.state);

        if (performAutomatically) {
            this.props.updateGameState(this.props.gameId, performAutomatically());
        }

        if (performOnConfirm) {
            const globalParams = {};

            (params || []).forEach((param) => {
                globalParams[param.name] = param.defaultValue;
            });

            this.props.updateGlobalGameParams(globalParams, true);
        }
    }

    render() {
        const { currentPlayer } = this.props.gameState;
        const awaitsAction = this.props.isLatestState && this.props.me.id === currentPlayer;

        return (
            <div
                className={classNames(
                    'cbf-helper-game',
                    { 'cbf-helper-game--awaits-action': awaitsAction }
                )}
            >
                {this.props.children}
            </div>
        );
    }
}

Game.propTypes = {
    children: PropTypes.node.isRequired,
    gameId: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    isGameActive: PropTypes.bool.isRequired,
    isLatestState: PropTypes.bool.isRequired,
    me: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired,
    updateGameState: PropTypes.func.isRequired,
    updateGlobalGameParams: PropTypes.func.isRequired,
};

export default Game;
