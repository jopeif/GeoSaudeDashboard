// src/api/client.ts

import axios from 'axios';

const api = axios.create({
    baseURL: 'https://geosaudeapi.onrender.com',
});

const refreshApi = axios.create({
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

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh-token')
        ) {
            originalRequest._retry = true;

            const refreshToken =
                localStorage.getItem('@App:refreshToken');

            if (!refreshToken) {
                window.location.href = '/login';

                return Promise.reject(error);
            }

            try {
                const response = await refreshApi.post(
                    '/auth/refresh-token',
                    {
                        refreshToken,
                    }
                );

                const accessToken =
                    response.data.user.access_token;

                const newRefreshToken =
                    response.data.user.refresh_token;

                localStorage.setItem(
                    '@App:token',
                    accessToken
                );

                localStorage.setItem(
                    '@App:refreshToken',
                    newRefreshToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem('@App:token');
                localStorage.removeItem('@App:refreshToken');
                localStorage.removeItem('@App:userId');
                localStorage.removeItem('@App:role');

                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;