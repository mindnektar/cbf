import api from 'api';

export const LOAD = 'LOAD';
export const LOAD_GAME_STATES = 'LOAD_GAME_STATES';

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

export const loadGameStates = id => dispatch => (
    api.fetchGameStates(id).then((gameStates) => {
        dispatch({
            type: LOAD_GAME_STATES,
            payload: { gameStates },
        });
    })
);
