// src/api/client.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://geosaudeapi.onrender.com', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@App:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('@App:refreshToken');

        try {
            const response = await axios.post('/refresh-token', { refreshToken });
            console.log(response)
            const { access_token, refresh_token } = response.data.user;

            localStorage.setItem('@App:token', access_token);
            localStorage.setItem('@App:refreshToken', refresh_token);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
        }
        return Promise.reject(error);
    }
);

export default api;