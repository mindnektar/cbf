import api from 'api';

export const LOAD = 'LOAD';

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
