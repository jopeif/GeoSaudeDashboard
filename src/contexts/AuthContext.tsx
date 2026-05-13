// src/contexts/AuthContext.tsx

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from 'react';

import { authService } from '../services/Auth.service';
import { userService } from '../services/User.service';

import type { UserDetails } from '../types/user';

interface AuthUser {
    id: string;

    role: string;

    access_token: string;

    refresh_token: string;

    profile?: UserDetails;
}

interface AuthContextData {
    user: AuthUser | null;

    loading: boolean;

    authenticated: boolean;

    signIn: (
        login: string,
        password: string
    ) => Promise<void>;

    signOut: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext =
    createContext<AuthContextData>(
        {} as AuthContextData
    );

const ALLOWED_ROLES = [
    'SUPERVISOR',
    'ADMIN',
    'SUPERADMIN',
    'ADM'
];

export const AuthProvider = ({
    children
}: AuthProviderProps) => {
    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    /* ========================================
       LOAD SESSION
    ======================================== */

    useEffect(() => {
        const loadSession = async () => {
            try {
                const token =
                    localStorage.getItem(
                        '@App:token'
                    );

                const role =
                    localStorage.getItem(
                        '@App:role'
                    );

                const id =
                    localStorage.getItem(
                        '@App:userId'
                    );

                const refreshToken =
                    localStorage.getItem(
                        '@App:refreshToken'
                    );

                if (
                    token &&
                    role &&
                    id &&
                    refreshToken
                ) {
                    const normalizedRole =
                        role.toUpperCase();

                    if (
                        !ALLOWED_ROLES.includes(
                            normalizedRole
                        )
                    ) {
                        authService.logout();

                        setUser(null);

                        return;
                    }

                    // busca dados completos do usuário
                    const userResponse =
                        await userService.findById(
                            id
                        );

                    if (
                        !userResponse.success ||
                        !userResponse.user
                    ) {
                        authService.logout();

                        setUser(null);

                        return;
                    }

                    // salva nome atualizado
                    localStorage.setItem(
                        '@App:userName',
                        userResponse.user.name
                    );

                    setUser({
                        id,

                        role,

                        access_token: token,

                        refresh_token:
                            refreshToken,

                        profile:
                            userResponse.user
                    });
                }
            } catch (error) {
                console.error(
                    'Erro ao carregar sessão:',
                    error
                );

                authService.logout();

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    /* ========================================
       LOGIN
    ======================================== */

    const signIn = useCallback(
        async (
            login: string,
            password: string
        ) => {
            const response =
                await authService.login(
                    login,
                    password
                );

            if (
                !response.success ||
                !response.user
            ) {
                throw new Error(
                    response.message ||
                    'Credenciais inválidas.'
                );
            }

            const role =
                response.user.role?.toUpperCase();

            if (
                !ALLOWED_ROLES.includes(role)
            ) {
                authService.logout();

                throw new Error(
                    'Você não possui permissão para acessar o painel.'
                );
            }

            // busca usuário completo
            const userResponse =
                await userService.findById(
                    response.user.id
                );

            if (
                !userResponse.success ||
                !userResponse.user
            ) {
                throw new Error(
                    'Erro ao carregar dados do usuário.'
                );
            }

            // salva nome
            localStorage.setItem(
                '@App:userName',
                userResponse.user.name
            );

            setUser({
                id: response.user.id,

                role: response.user.role,

                access_token:
                    response.user
                        .access_token,

                refresh_token:
                    response.user
                        .refresh_token,

                profile:
                    userResponse.user
            });
        },
        []
    );

    /* ========================================
       LOGOUT
    ======================================== */

    const signOut = useCallback(() => {
        authService.logout();

        setUser(null);
    }, []);

    /* ========================================
       MEMO
    ======================================== */

    const value = useMemo(
        () => ({
            user,

            loading,

            authenticated: !!user,

            signIn,

            signOut
        }),
        [
            user,
            loading,
            signIn,
            signOut
        ]
    );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};

/* ========================================
   HOOK
======================================== */

export const useAuth = () => {
    return useContext(AuthContext);
};