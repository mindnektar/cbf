import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import MatchContext from 'contexts/MatchContext';
import getNextMatchAwaitingAction from 'helpers/getNextMatchAwaitingAction';
import games from 'data/games';
import GameModel from 'models/play/game';

const Table = (props) => {
    const nextMatchAwaitingAction = getNextMatchAwaitingAction(props.data.me);
    const awaitsAction = (
        !props.data.match.historyMode
        && nextMatchAwaitingAction
        && nextMatchAwaitingAction.id === props.data.match.id
    );
    const matchContextData = {
        match: props.data.match,
        me: props.data.me,
        performAction: props.performAction,
        pushActions: props.pushActions,
    };

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
                <MatchContext.Provider value={matchContextData}>
                    {React.createElement(games[props.data.match.handle].component, {
                        match: props.data.match,
                        me: props.data.me,
                    })}
                </MatchContext.Provider>
            </div>
        </div>
    );
};

Table.propTypes = {
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    performAction: PropTypes.func.isRequired,
    pushActions: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(React.memo(Table, (prevProps, nextProps) => (
    prevProps.data.match.stateIndex === nextProps.data.match.stateIndex
    && getNextMatchAwaitingAction(nextProps.data.me)
    && getNextMatchAwaitingAction(prevProps.data.me)
))));
