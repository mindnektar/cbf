import api from 'api';

export const LOAD = 'LOAD';

export const load = () => dispatch => (
    Promise.all([
        api.fetchGames(),
        api.fetchMe(),
    ]).then(([games, me]) => {
        dispatch({
            type: LOAD,
            payload: {
                games,
                me,
                ui: {
                    isSystemLoaded: true,
                },
            },
        });
    })
);
