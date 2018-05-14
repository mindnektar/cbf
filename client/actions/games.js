import api from 'api';
import gameConstants from 'shared/constants/games';
import { loadGameStates } from 'actions/populate';

export const ADD_PLAYER_TO_GAME = 'ADD_PLAYER_TO_GAME';
export const CHANGE_ACTION_INDEX = 'CHANGE_ACTION_INDEX';
export const CHANGE_GAME_STATUS = 'CHANGE_GAME_STATUS';
export const CREATE_GAME = 'CREATE_GAME';
export const PUSH_GAME_STATE = 'PUSH_GAME_STATE';
export const SWITCH_GAME_STATE = 'SWITCH_GAME_STATE';
export const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE';
export const UPDATE_GLOBAL_GAME_PARAMS = 'UPDATE_GLOBAL_GAME_PARAMS';

export const createGame = game => dispatch => (
    api.createGame(game).then((newGame) => {
        dispatch({
            type: CREATE_GAME,
            payload: newGame,
        });

        return newGame;
    })
);

export const joinGame = id => (dispatch, getState) => (
    api.joinGame(id).then(() => {
        dispatch({
            type: ADD_PLAYER_TO_GAME,
            payload: { id, userId: getState().me.id },
        });
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
    let { actionIndex } = gameStates;

    do {
        actionIndex += 1;
    } while (
        actionIndex < gameStates.actions.length &&
        states.findById(gameStates.states[lastStateIndex + actionIndex].state).performAutomatically
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

export const switchToLatestGameState = () => (dispatch, getState) => {
    const { gameStates } = getState();
    const latestState = (gameStates.stateCountSinceLastLoad - 1) + gameStates.actionIndex;

    dispatch(switchGameState(latestState));
};

export const undoGameAction = states => (dispatch, getState) => {
    const { gameStates } = getState();
    const lastStateIndex = gameStates.stateCountSinceLastLoad - 1;
    let { actionIndex } = gameStates;

    do {
        actionIndex -= 1;
    } while (
        actionIndex > 0 &&
        states.findById(gameStates.states[lastStateIndex + actionIndex].state).performAutomatically
    );

    dispatch({
        type: CHANGE_ACTION_INDEX,
        payload: { actionIndex },
    });
};

export const updateGameState = (gameId, action, payload = []) => (dispatch, getState) => {
    const { gameStates } = getState();
    const previousState = gameStates.states[
        (gameStates.stateCountSinceLastLoad - 1) + gameStates.actionIndex
    ];
    const nextAction = [action.id, payload];

    if (action.isServerAction) {
        return api.handleGameActions(
            gameId,
            [
                ...gameStates.actions,
                nextAction,
            ]
        ).then(() => dispatch(loadGameStates(gameId)));
    }

    const nextState = {
        ...action.perform(previousState, payload),
        action: [...nextAction, previousState.currentPlayer],
    };

    dispatch({
        type: UPDATE_GAME_STATE,
        payload: { nextAction, nextState },
    });

    return Promise.resolve();
};

export const updateGlobalGameParams = (params, reset = false) => ({
    type: UPDATE_GLOBAL_GAME_PARAMS,
    payload: { params, reset },
});
