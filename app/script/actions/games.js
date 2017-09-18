import api from 'api';
import gameConstants from 'shared/constants/games';
import { JOIN_GAME } from 'actions/me';
import { loadGameStates } from 'actions/populate';

export const ADD_PLAYER_TO_GAME = 'ADD_PLAYER_TO_GAME';
export const CREATE_GAME = 'CREATE_GAME';
export const CHANGE_GAME_STATUS = 'CHANGE_GAME_STATUS';
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

export const handleGameActions = (id, actions) => dispatch => (
    api.handleGameActions(id, actions).then(() => dispatch(loadGameStates(id)))
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

export const updateGameState = (
    gameId, action, transformers, data = []
) => (dispatch, getState) => {
    const { gameStates } = getState();
    const previousState = gameStates.states[gameStates.states.length - 1];
    const nextAction = [action, data];
    const nextState = transformers[action](previousState, data);

    nextState.action = [
        ...nextAction,
        previousState.currentPlayer,
    ];

    dispatch({
        type: UPDATE_GAME_STATE,
        payload: { nextAction, nextState },
    });
};

export const updateGlobalGameParams = payload => ({
    type: UPDATE_GLOBAL_GAME_PARAMS,
    payload,
});
