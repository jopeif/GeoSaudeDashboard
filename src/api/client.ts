import axios, {
    type InternalAxiosRequestConfig,
} from 'axios';

interface RetryAxiosRequestConfig
    extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const BASE_URL =
    'https://geosaudeapi.onrender.com';


const api = axios.create({
    baseURL: BASE_URL,
});

const refreshApi = axios.create({
    baseURL: BASE_URL,
});

/* ========================================
   REFRESH LOCK
======================================== */

let isRefreshing = false;

let refreshPromise:
    | Promise<any>
    | null = null;

/* ========================================
   REQUEST
======================================== */

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem(
                '@App:token'
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

/* ========================================
   RESPONSE
======================================== */

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest =
            error.config as RetryAxiosRequestConfig;

        const status =
            error.response?.status;

        const isRefreshRoute =
            originalRequest?.url?.includes(
                '/auth/refresh-token'
            );

        if (
            ![401, 403].includes(
                status
            ) ||
            originalRequest._retry ||
            isRefreshRoute
        ) {
            return Promise.reject(
                error
            );
        }

        originalRequest._retry = true;

        const refreshToken =
            localStorage.getItem(
                '@App:refreshToken'
            );

        if (!refreshToken) {
            clearSession();

            return Promise.reject(
                error
            );
        }

        try {
            /* ============================
               REFRESH LOCK
            ============================ */

            if (
                !isRefreshing
            ) {
                isRefreshing =
                    true;

                refreshPromise =
                    refreshApi.post(
                        '/auth/refresh-token',
                        {
                            refreshToken,
                        }
                    );
            }

            const response =
                await refreshPromise;

            const accessToken =
                response.data.user
                    .access_token;

            const newRefreshToken =
                response.data.user
                    .refresh_token;

            /* ============================
               SAVE
            ============================ */

            localStorage.setItem(
                '@App:token',
                accessToken
            );

            localStorage.setItem(
                '@App:refreshToken',
                newRefreshToken
            );

            /* ============================
               UPDATE CONTEXT
            ============================ */

            window.dispatchEvent(
                new CustomEvent(
                    'auth:update',
                    {
                        detail: {
                            accessToken,

                            refreshToken:
                                newRefreshToken,
                        },
                    }
                )
            );

            /* ============================
               RETRY REQUEST
            ============================ */

            originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

            return api(
                originalRequest
            );

        } catch (
            refreshError
        ) {
            clearSession();

            return Promise.reject(
                refreshError
            );

        } finally {
            isRefreshing =
                false;

            refreshPromise =
                null;
        }
    }
);

/* ========================================
   HELPERS
======================================== */

function clearSession() {
    localStorage.removeItem(
        '@App:token'
    );

    localStorage.removeItem(
        '@App:refreshToken'
    );

    localStorage.removeItem(
        '@App:userId'
    );

    localStorage.removeItem(
        '@App:role'
    );

    localStorage.removeItem(
        '@App:userName'
    );

    window.location.href =
        '/login';
}

export default api;