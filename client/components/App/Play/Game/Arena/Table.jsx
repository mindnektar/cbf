import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import games from 'data/games';
import GameModel from 'models/play/game';

const Table = (props) => {
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
        } = games[props.data.match.handle].states.findById(state.state);

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
    const awaitsAction = isLatestState && props.data.me && activePlayers.includes(props.data.me.id);

    return (
        <div
            className={classNames(
                'cbf-table',
                { 'cbf-table--awaits-action': awaitsAction }
            )}
        >
            <div className="cbf-table__legs">
                <div />
                <div />
                <div />
                <div />
            </div>

            <div className="cbf-table__content">
                {props.children}
            </div>
        </div>
    );
};

Table.propTypes = {
    children: PropTypes.node.isRequired,
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withRouter(GameModel.graphql(Table));
