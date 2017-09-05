import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

const request = (url, method, body) => (
    fetch(url, {
        method,
        body: JSON.stringify({
            ...body,
            access_token: Cookies.get('access-token'),
        }),
        headers: {
            'Content-type': 'application/json',
        },
    })
).then((response) => {
    console.log(response);
    return response;
});

const login = (username, password) => (
    request('/api/auth', 'POST', { username, password })
);

export default {
    login,
};
