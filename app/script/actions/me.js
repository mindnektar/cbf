import api from 'api';

export const JOIN_GAME = 'JOIN_GAME';

export const joinGame = id => dispatch => (
    api.joinGame(id).then(() => {
        dispatch({
            type: JOIN_GAME,
            payload: { id, admin: 0 },
        });
    })
);
