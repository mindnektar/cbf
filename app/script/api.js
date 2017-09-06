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

const changeGame = (id, data) => request('games', 'PATCH', { id, data });

const createGame = game => request('games', 'POST', { game });

const fetchGames = () => request('games');

const fetchGameStates = id => request(`game_states/${id}`);

const joinGame = id => request('user_in_game', 'POST', { id });

// users

const fetchMe = () => request('me');

const fetchUsers = () => request('users');

export default {
    login,
    changeGame,
    createGame,
    fetchGames,
    fetchGameStates,
    fetchUsers,
    joinGame,
    fetchMe,
};
