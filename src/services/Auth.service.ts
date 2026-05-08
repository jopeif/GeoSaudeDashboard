import api from '../api/client';
import { type User, type LoginResponse } from '../types/auth';

const STORAGE_KEYS = {
    TOKEN: '@App:token',
    REFRESH_TOKEN: '@App:refreshToken',
    USER_ID: '@App:userId',
    USER_ROLE: '@App:role',
    USER_NAME: '@App:userName'
};

export const authService = {
    async login(login: string, password: string): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/login/', { login, password });
        
        if (data.success && data.user) {
        this.saveSession(data.user);
        }
        
        return data;
    },

    async refreshToken(refreshToken: string): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/refresh-token/', { refreshToken });
        
        if (data.success && data.user) {
        this.saveSession(data.user);
        }
        
        return data;
    },

    async getMe() {
        const { data } = await api.get('/auth/me/');
        return data;
    },

    saveSession(user: User) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, user.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, user.refresh_token);
        localStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, user.role);
    },

    logout() {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    }
};