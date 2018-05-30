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
        api.fetchGames().then(games => dispatch({
            type: LOAD,
            payload: {
                games: games.reduce((result, current) => ({
                    ...result,
                    [current.id]: current,
                }), {}),
            },
        })),
        api.fetchUsers().then(users => dispatch({
            type: LOAD,
            payload: {
                users: users.reduce((result, current) => ({
                    ...result,
                    [current.id]: current,
                }), {}),
            },
        })),
        api.fetchMe().then(me => dispatch({
            type: LOAD,
            payload: { me },
        })),
    ]).finally(() => dispatch({
        type: LOAD,
        payload: {
            ui: {
                isSystemLoaded: true,
            },
        },
    }))
);

export const unload = () => ({
    type: UNLOAD,
});

export const loadGameStates = id => dispatch => (
    api.fetchGameStates(id).then(({ gameStates }) => {
        dispatch({
            type: LOAD_GAME_STATES,
            payload: { id, gameStates },
        });

        return gameStates;
    })
);
