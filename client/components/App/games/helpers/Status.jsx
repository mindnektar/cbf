import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import performAction from 'helpers/performAction';
import GameModel from 'models/play/game';
import Button from 'atoms/Button';

const Status = (props) => {
    const state = props.data.match.states[props.data.match.stateIndex];
    const isLatestState = props.data.match.stateIndex === props.data.match.states.length - 1;

    const getInstruction = () => {
        if (!isLatestState) {
            return '- HISTORY MODE -';
        }

        if (props.data.match.status === 'FINISHED') {
            const winner = props.data.match.players.sort((a, b) => b.score - a.score)[0];

            return `${winner.name} won the game!`;
        }

        if (!props.data.me || !state.activePlayers.includes(props.data.me.id)) {
            const playerList = props.data.match.players
                .filter(({ id }) => state.activePlayers.includes(id))
                .map(({ name }) => `${name}'s`)
                .join(' and ');
            return `It's ${playerList} turn.`;
        }

        return props.states.findById(state.state).instruction || '';
    };

    const continueTurn = () => {
        const { performOnConfirm, params } = props.states.findById(state.state);

        props.updateGameState(
            props.match.params.gameId,
            performOnConfirm(),
            params.map((param) => props.data.match.globalParams[param.name]),
        );
    };

    const endTurn = () => {
        performAction({
            match: props.data.match,
            action: props.endTurnAction,
            player: props.data.me,
            payload: props.data.match.globalParams,
            performAction: props.performAction,
            pushActions: props.pushActions,
        });
    };

    const exitHistoryMode = () => {
        props.switchToLatestGameState();
    };

    const mayContinueTurn = () => {
        const { performOnConfirm, params } = props.states.findById(state.state);

        return (
            isLatestState
            && state.activePlayers.includes(props.data.me.id)
            && params.every((param) => props.data.match.globalParams[param.name] !== undefined)
            && performOnConfirm().isValid({
                state,
                payload: params.map((param) => props.data.match.globalParams[param.name]),
            })
        );
    };

    const mayEndTurn = () => (
        isLatestState
        && props.data.me
        && state.activePlayers.includes(props.data.me.id)
        && props.endTurnAction.isValid({ state })
    );

    const redo = () => {
        props.goToAction({
            id: props.data.match.id,
            index: props.data.match.stateIndex + 1,
        });
    };

    const undo = () => {
        props.goToAction({
            id: props.data.match.id,
            index: props.data.match.stateIndex - 1,
        });
    };

    return ReactDOM.createPortal(
        <div className="cbf-helper-status">
            <div className="cbf-helper-status__text">
                {getInstruction()}

                {props.states.findById(state.state).performOnConfirm && (
                    <Button
                        disabled={!mayContinueTurn()}
                        onClick={continueTurn}
                        secondary
                    >
                        Continue
                    </Button>
                )}

                {!isLatestState && (
                    <Button
                        onClick={exitHistoryMode}
                        secondary
                    >
                        Exit
                    </Button>
                )}
            </div>

            <div className="cbf-helper-status__options">
                <Button
                    disabled={props.data.match.stateIndex - (props.data.match.stateCountSinceLastLoad) < 0}
                    onClick={undo}
                    secondary
                >
                    Undo
                </Button>

                <Button
                    disabled={props.data.match.stateIndex === props.data.match.states.length - 1}
                    onClick={redo}
                    secondary
                >
                    Redo
                </Button>

                <Button
                    disabled={!mayEndTurn()}
                    onClick={endTurn}
                    secondary
                >
                    End turn
                </Button>
            </div>
        </div>,
        document.body
    );
};

Status.propTypes = {
    endTurnAction: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    pushActions: PropTypes.func.isRequired,
    performAction: PropTypes.func.isRequired,
    goToAction: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Status));
