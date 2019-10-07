import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import handleAction from 'helpers/handleAction';
import determineRanks from 'helpers/determineRanks';
import games from 'data/games';
import GameModel from 'models/play/game';
import Button from 'atoms/Button';

const Status = (props) => {
    const state = props.data.match.states[props.data.match.stateIndex];
    const isLatestState = props.data.match.stateIndex === props.data.match.states.length - 1;

    const getInstruction = () => {
        if (props.data.match.historyMode) {
            return '- HISTORY MODE -';
        }

        if (props.data.match.status === 'FINISHED') {
            const winners = determineRanks(props.data.match.scores).filter(({ rank }) => (
                rank === 1
            ));

            if (winners.length === 1) {
                return `${winners[0].player.name} won the game!`;
            }

            const winnerNames = winners.map(({ player }) => player.name);

            return `It's a tie between ${winnerNames.slice(0, -1).join(', ')} and ${winnerNames.pop()}!`;
        }

        if (!props.data.me || !state.activePlayers.includes(props.data.me.id)) {
            const playerList = props.data.match.players
                .filter(({ id }) => state.activePlayers.includes(id))
                .map(({ name }) => `${name}'s`)
                .join(' and ');

            return `It's ${playerList} turn.`;
        }

        const { instruction } = games[props.data.match.handle].states.findById(state.state);

        return instruction ? instruction(state) : '';
    };

    const endTurn = () => {
        handleAction({
            match: props.data.match,
            action: games[props.data.match.handle].actions.END_TURN,
            player: props.data.me,
            payload: props.data.match.globalParams,
            performAction: props.performAction,
            pushActions: props.pushActions,
        });
    };

    const exitHistoryMode = () => {
        props.goToAction({
            id: props.data.match.id,
            index: props.data.match.states.length - 1,
            historyMode: false,
        });
    };

    const mayEndTurn = () => (
        isLatestState
        && !props.data.match.historyMode
        && props.data.me
        && state.activePlayers.includes(props.data.me.id)
        && games[props.data.match.handle].actions.END_TURN.isValid({ state })
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

    return (
        <div className="cbf-status">
            <div className="cbf-status__text">
                {getInstruction()}

                {props.data.match.historyMode && (
                    <Button
                        onClick={exitHistoryMode}
                        secondary
                    >
                        Exit
                    </Button>
                )}
            </div>

            <div className="cbf-status__options">
                <Button
                    disabled={
                        props.data.match.historyMode
                        || (
                            props.data.match.stateIndex
                            - (props.data.match.stateCountSinceLastLoad) < 0
                        )
                    }
                    onClick={undo}
                    secondary
                >
                    Undo
                </Button>

                <Button
                    disabled={
                        props.data.match.historyMode
                        || props.data.match.stateIndex === props.data.match.states.length - 1
                    }
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
        </div>
    );
};

Status.propTypes = {
    match: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    pushActions: PropTypes.func.isRequired,
    performAction: PropTypes.func.isRequired,
    goToAction: PropTypes.func.isRequired,
};

export default withRouter(GameModel.graphql(Status));
