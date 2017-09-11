import api from 'api';
import { ADD_PLAYER_TO_GAME } from 'actions/games';

export const JOIN_GAME = 'JOIN_GAME';

export const joinGame = id => (dispatch, getState) => (
    api.joinGame(id).then(() => {
        dispatch({
            type: JOIN_GAME,
            payload: { id, admin: 0 },
        });

        dispatch({
            type: ADD_PLAYER_TO_GAME,
            payload: { id, userId: getState().me.id },
        });
    })
);
