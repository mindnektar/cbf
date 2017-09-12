import api from 'api';

export const CLEAR_GAME_STATES = 'CLEAR_GAME_STATES';
export const LOAD = 'LOAD';
export const LOAD_GAME_STATES = 'LOAD_GAME_STATES';
export const UNLOAD = 'UNLOAD';

export const clearGameStates = () => ({
    type: CLEAR_GAME_STATES,
});

export const load = () => dispatch => (
    Promise.all([
        api.fetchGames(),
        api.fetchUsers(),
        api.fetchMe(),
    ]).then(([games, users, me]) => {
        dispatch({
            type: LOAD,
            payload: {
                games,
                me,
                ui: {
                    isSystemLoaded: true,
                },
                users,
            },
        });
    })
);

export const unload = () => ({
    type: UNLOAD,
});

export const loadGameStates = id => dispatch => (
    api.fetchGameStates(id).then(({ playerOrder, gameStates }) => {
        dispatch({
            type: LOAD_GAME_STATES,
            payload: { id, playerOrder, gameStates },
        });

        return gameStates;
    })
);
