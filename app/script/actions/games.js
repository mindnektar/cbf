import api from 'api';

export const CREATE_GAME = 'CREATE_GAME';

export const createGame = game => dispatch => (
    api.createGame(game).then((newGame) => {
        dispatch({
            type: CREATE_GAME,
            payload: newGame,
        });

        return newGame;
    })
);
