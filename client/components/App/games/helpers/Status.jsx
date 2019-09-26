import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import GameModel from 'models/play/game';
import Button from 'Button';

const Status = (props) => {
    const state = props.data.match.states[props.data.match.stateIndex];
    const isLatestState = props.data.match.stateIndex === props.data.match.states.length - 1;

    const getInstruction = () => {
        if (!isLatestState) {
            return '- HISTORY MODE -';
        }

        // if (props.game.scores.length > 0) {
        //     return `${props.users[props.game.scores[0].player].username} won the game!`;
        // }

        if (!state.activePlayers.includes(props.data.me.id)) {
            return `It's ${props.data.me.name}'s turn.`;
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
        props.updateGameState(
            props.match.params.gameId,
            props.endTurnAction,
            props.data.match.globalParams,
        );
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
            && performOnConfirm().isValid(
                state,
                params.map((param) => props.data.match.globalParams[param.name])
            )
        );
    };

    const mayEndTurn = () => (
        isLatestState
        && state.activePlayers.includes(props.data.me.id)
        && props.endTurnAction.isValid(state)
    );

    const redo = () => {
        props.redoGameAction(props.states);
    };

    const undo = () => {
        props.undoGameAction(props.states);
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
                    disabled={props.stateIndex === 0}
                    onClick={undo}
                    secondary
                >
                    Undo
                </Button>

                <Button
                    disabled={props.stateIndex === props.data.match.states.length}
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
};

export default withRouter(GameModel.graphql(Status));
