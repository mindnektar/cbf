import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

const request = (path, method = 'GET', body) => (
    fetch(`/api/${path}`, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
            'x-auth': Cookies.get('auth-token'),
            'Content-type': 'application/json',
        },
    })
).then(response => (
    new Promise((resolve, reject) => {
        switch (response.status) {
            case 200: {
                if (response.headers.get('x-auth')) {
                    Cookies.set('auth-token', response.headers.get('x-auth'));
                }

                resolve(response.json(), response.headers);
                break;
            }

            case 204:
                resolve(null);
                break;

            case 400:
                reject(response.json());
                break;

            case 401:
                reject(response.json());
                break;

            case 404:
                reject(response.json());
                break;

            case 500:
                reject(new Error('server error'));
                break;

            default:
                response.json().then(reject);
        }
    })
));

export default {
    changeGame: (id, data) => request(`matches/${id}`, 'PATCH', data),
    createGame: handle => request('matches', 'POST', { handle }),
    fetchGames: () => request('matches'),
    fetchGameStates: id => request(`matches/${id}`),
    handleGameActions: (id, actions) => request(`matches/${id}/actions`, 'POST', actions),
    joinGame: id => request(`matches/${id}/players`, 'POST'),

    fetchMe: () => request('users/me'),
    fetchUsers: () => request('users'),
    login: (username, password) => request('users/login', 'POST', { username, password }),
};
