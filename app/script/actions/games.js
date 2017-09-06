import api from 'api';

export const CREATE_GAME = 'CREATE_GAME';
export const JOIN_GAME = 'JOIN_GAME';

export const createGame = game => (dispatch, getState) => (
    api.createGame(game).then((newGame) => {
        dispatch({
            type: CREATE_GAME,
            payload: newGame,
        });

        dispatch({
            type: JOIN_GAME,
            payload: { id: newGame.id, userId: getState().me.id, admin: true },
        });

        return newGame;
    })
);

export const joinGame = id => (dispatch, getState) => (
    api.joinGame(id).then(() => {
        dispatch({
            type: JOIN_GAME,
            payload: { id, userId: getState().me.id, admin: false },
        });
    })
);
