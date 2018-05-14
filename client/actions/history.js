import * as history from 'react-router-redux';

const buildLocation = (params) => {
    let state = null;

    if (typeof params[params.length - 1] === 'object') {
        state = params.pop();
    }

    return {
        pathname: `/${params.join('/')}`,
        state,
    };
};

export const goBack = history.goBack;

export const push = (...path) => dispatch => (
    dispatch(history.push(buildLocation(path)))
);

export const replace = (...path) => dispatch => (
    dispatch(history.replace(buildLocation(path)))
);
