import { api } from '../api/client';

const res = await api('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }) 
});

localStorage.setItem('accessToken', res.TOKEN_SECRET);