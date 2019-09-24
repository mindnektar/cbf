import Cookies from 'cookies-js';

export const AUTH_TYPE_NONE = 'cbf-token-none';
export const AUTH_TYPE_USER = 'cbf-token-user';

export const getToken = (authType) => Cookies.get(authType);

export const setToken = (authType, token, userOptions = {}) => {
    Cookies.set(authType, token, {
        expires: Infinity,
        ...userOptions,
    });
};

export const deleteToken = (authType) => Cookies.expire(authType);
