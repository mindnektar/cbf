import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';

const Game = (props) => {
    useEffect(() => {
        checkAutomaticActions();
    });

    const state = props.data.match.states[props.data.match.stateIndex];
    const isLatestState = props.data.match.stateIndex === props.data.match.states.length - 1;
    const isGameActive = props.data.match.status === 'ACTIVE';

    const checkAutomaticActions = () => {
        if (!isLatestState || !isGameActive) {
            return;
        }

        const {
            performAutomatically,
            performOnConfirm,
            params,
        } = props.states.findById(state.state);

        if (performAutomatically) {
            props.updateGameState(props.match.params.gameId, performAutomatically());
        }

        if (performOnConfirm) {
            const globalParams = {};

            (params || []).forEach((param) => {
                globalParams[param.name] = param.defaultValue;
            });

            props.updateGlobalGameParams(globalParams, true);
        }
    };

    const { activePlayers } = state;
    const awaitsAction = isLatestState && activePlayers.includes(props.data.me.id);

    return (
        <div
            className={classNames(
                'cbf-helper-game',
                { 'cbf-helper-game--awaits-action': awaitsAction }
            )}
        >
            {props.children}
        </div>
    );
};

Game.propTypes = {
    children: PropTypes.node.isRequired,
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Game));
