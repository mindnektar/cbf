import api from 'api';
import gameConstants from 'shared/constants/games';
import { JOIN_GAME } from 'actions/me';

export const CREATE_GAME = 'CREATE_GAME';
export const CHANGE_GAME_STATUS = 'CHANGE_GAME_STATUS';

export const createGame = game => dispatch => (
    api.createGame(game).then((newGame) => {
        dispatch({
            type: CREATE_GAME,
            payload: newGame,
        });

        dispatch({
            type: JOIN_GAME,
            payload: { id: newGame.id, admin: true },
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
