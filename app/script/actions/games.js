import api from 'api';
import gameConstants from 'shared/constants/games';
import { JOIN_GAME } from 'actions/me';
import { loadGameStates } from 'actions/populate';

export const CREATE_GAME = 'CREATE_GAME';
export const CHANGE_GAME_STATUS = 'CHANGE_GAME_STATUS';
export const PUSH_GAME_STATE = 'PUSH_GAME_STATE';
export const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE';

export const createGame = game => dispatch => (
    api.createGame(game).then((newGame) => {
        dispatch({
            type: CREATE_GAME,
            payload: newGame,
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

export const updateGameState = (action, transformers, data = []) => ({
    type: UPDATE_GAME_STATE,
    payload: { action, data, transformers },
});
