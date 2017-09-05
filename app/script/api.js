import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

const request = (path, method = 'GET', body) => (
    fetch(`/api/${path}`, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
            'X-Access-token': Cookies.get('access-token'),
            'Content-type': 'application/json',
        },
    })
).then(response => (
    new Promise((resolve, reject) => {
        console.log(response);

        switch (response.status) {
            case 200:
                resolve(response.json());
                break;

            case 204:
                resolve(null);
                break;

            case 404:
                reject({ errors: 'not found' });
                break;

            case 500:
                reject({ errors: 'server error' });
                break;

            default:
                response.json().then(reject);
        }
    })
));

// auth

const login = (username, password) => (
    request('auth', 'POST', { username, password })
);

// games

const fetchGames = () => request('games');

// me

const fetchMe = () => request('me');

export default {
    login,
    fetchGames,
    fetchMe,
};
