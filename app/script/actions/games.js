import api from 'api';
import gameConstants from 'shared/constants/games';
import { JOIN_GAME } from 'actions/me';
import { loadGameStates } from 'actions/populate';

export const ADD_PLAYER_TO_GAME = 'ADD_PLAYER_TO_GAME';
export const CHANGE_ACTION_INDEX = 'CHANGE_ACTION_INDEX';
export const CHANGE_GAME_STATUS = 'CHANGE_GAME_STATUS';
export const CREATE_GAME = 'CREATE_GAME';
export const PUSH_GAME_STATE = 'PUSH_GAME_STATE';
export const SWITCH_GAME_STATE = 'SWITCH_GAME_STATE';
export const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE';
export const UPDATE_GLOBAL_GAME_PARAMS = 'UPDATE_GLOBAL_GAME_PARAMS';

export const createGame = game => (dispatch, getState) => (
    api.createGame(game).then((newGame) => {
        dispatch({
            type: CREATE_GAME,
            payload: {
                ...newGame,
                players: [getState().me.id],
            },
        });

        dispatch({
            type: JOIN_GAME,
            payload: { id: newGame.id, admin: 1 },
        });

        return newGame;
    })
);

export const openGame = id => (dispatch) => {
    const status = gameConstants.GAME_STATUS_OPEN;

    return api.changeGame(id, { status }).then(() => {
        dispatch({
            type: CHANGE_GAME_STATUS,
            payload: { id, status },
        });
    });
};

export const redoGameAction = states => (dispatch, getState) => {
    const { gameStates } = getState();
    const lastStateIndex = gameStates.stateCountSinceLastLoad - 1;
    let actionIndex = gameStates.actionIndex;

    do {
        actionIndex += 1;
    } while (
        actionIndex < gameStates.actions.length &&
        states[gameStates.states[lastStateIndex + actionIndex].state].performAutomatically
    );

    dispatch({
        type: CHANGE_ACTION_INDEX,
        payload: { actionIndex },
    });
};

export const startGame = id => (dispatch) => {
    const status = gameConstants.GAME_STATUS_ACTIVE;

    return api.changeGame(id, { status }).then(() => {
        dispatch({
            type: CHANGE_GAME_STATUS,
            payload: { id, status },
        });
    });
};

export const switchGameState = currentState => ({
    type: SWITCH_GAME_STATE,
    payload: { currentState },
});

export const undoGameAction = states => (dispatch, getState) => {
    const { gameStates } = getState();
    const lastStateIndex = gameStates.stateCountSinceLastLoad - 1;
    let actionIndex = gameStates.actionIndex;

    do {
        actionIndex -= 1;
    } while (
        actionIndex > 0 &&
        states[gameStates.states[lastStateIndex + actionIndex].state].performAutomatically
    );

    dispatch({
        type: CHANGE_ACTION_INDEX,
        payload: { actionIndex },
    });
};

export const updateGameState = (gameId, action, data = []) => (dispatch, getState) => {
    const { gameStates } = getState();
    const previousState = gameStates.states[
        (gameStates.stateCountSinceLastLoad - 1) + gameStates.actionIndex
    ];
    const nextAction = [action.id, data];

    if (action.isServerAction) {
        return api.handleGameActions(
            gameId,
            [
                ...gameStates.actions,
                nextAction,
            ]
        ).then(() => dispatch(loadGameStates(gameId)));
    }

    const nextState = action.perform(previousState, data);

    nextState.action = [
        ...nextAction,
        previousState.currentPlayer,
    ];

    dispatch({
        type: UPDATE_GAME_STATE,
        payload: { nextAction, nextState },
    });

    return Promise.resolve();
};

export const updateGlobalGameParams = payload => ({
    type: UPDATE_GLOBAL_GAME_PARAMS,
    payload,
});
