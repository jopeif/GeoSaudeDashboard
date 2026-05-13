export interface User {
    id: string;
    access_token: string;
    refresh_token: string;
    role: 'AGENT' | 'ADMIN'; // Exemplo de roles
}

export interface LoginResponse {
    success: boolean;
    user: User;
    message?: string
}