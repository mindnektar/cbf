import Cookies from 'js-cookie';
import api from 'api';
import { push } from 'actions/history';

export const login = (username, password) => dispatch => (
    api.login(username, password).then(() => {
        dispatch(push('play'));

        window.location.reload();
    })
);

export const logout = () => () => {
    Cookies.remove('auth-token');

    window.location.reload();
};
