import Cookies from 'js-cookie';
import api from 'api';
import { push } from 'actions/history';

export const login = (username, password) => dispatch => (
    api.login(username, password).then(
        (response) => {
            Cookies.set('access-token', response.token);

            dispatch(push('play'));

            window.location.reload();
        },
        console.log
    )
);

export const logout = () => () => {
    Cookies.remove('access-token');

    window.location.reload();
};
