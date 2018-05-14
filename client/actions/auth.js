import Cookies from 'js-cookie';
import api from 'api';
import { push } from 'actions/history';

export const login = (username, password) => dispatch => (
    api.login(username, password).then(
        (response) => {
            if (response.error) {
                console.log(response.error);
                return;
            }

            Cookies.set('auth-token', response.token);

            dispatch(push('play'));

            window.location.reload();
        },
        console.log
    )
);

export const logout = () => () => {
    Cookies.remove('auth-token');

    window.location.reload();
};
