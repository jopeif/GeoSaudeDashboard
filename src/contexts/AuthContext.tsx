import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
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

    selectedPanel: string | null;

    signIn: (
        login: string,
        password: string
    ) => Promise<AuthUser>;

    signOut: () => void;

    setSelectedPanel: (
        panel: string | null
    ) => void;

    updateSession: (
        accessToken: string,
        refreshToken?: string
    ) => void;
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
    'ADM',
];

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {

    const [user, setUser] =
        useState<AuthUser | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const [
        selectedPanel,
        setSelectedPanelState
    ] = useState<string | null>(
        localStorage.getItem(
            '@App:selectedPanel'
        )
    );

    /* ========================================
       PANEL
    ======================================== */

    const setSelectedPanel =
        useCallback(
            (
                panel: string | null
            ) => {

                if (panel) {
                    localStorage.setItem(
                        '@App:selectedPanel',
                        panel
                    );
                } else {
                    localStorage.removeItem(
                        '@App:selectedPanel'
                    );
                }

                setSelectedPanelState(
                    panel
                );

            },
            []
        );

    /* ========================================
       UPDATE SESSION
    ======================================== */

    const updateSession =
        useCallback(
            (
                accessToken: string,
                refreshToken?: string
            ) => {

                setUser(
                    prev => {

                        if (!prev) {
                            return null;
                        }

                        return {
                            ...prev,

                            access_token:
                                accessToken,

                            refresh_token:
                                refreshToken ||
                                prev.refresh_token,
                        };
                    }
                );

            },
            []
        );

    /* ========================================
       REFRESH LISTENER
    ======================================== */

    useEffect(() => {

        const listener = (
            event: Event
        ) => {

            const customEvent =
                event as CustomEvent;

            const {
                accessToken,
                refreshToken,
            } =
                customEvent.detail;

            updateSession(
                accessToken,
                refreshToken
            );

        };

        window.addEventListener(
            'auth:update',
            listener
        );

        return () => {

            window.removeEventListener(
                'auth:update',
                listener
            );

        };

    }, [
        updateSession,
    ]);

    /* ========================================
       LOAD SESSION
    ======================================== */

    useEffect(() => {

        const loadSession =
            async () => {

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
                        !token ||
                        !role ||
                        !id ||
                        !refreshToken
                    ) {
                        return;
                    }

                    const normalizedRole =
                        role.toUpperCase();

                    if (
                        !ALLOWED_ROLES.includes(
                            normalizedRole
                        )
                    ) {

                        authService.logout();

                        return;

                    }

                    let profile:
                        | UserDetails
                        | undefined;

                    try {

                        const userResponse =
                            await userService.findById(
                                id
                            );

                        if (
                            userResponse.success &&
                            userResponse.user
                        ) {

                            profile =
                                userResponse.user;

                            localStorage.setItem(
                                '@App:userName',
                                profile.name
                            );

                        }

                    } catch {
                        //
                    }

                    setUser({
                        id,
                        role,

                        access_token:
                            token,

                        refresh_token:
                            refreshToken,

                        profile,
                    });

                } finally {

                    setLoading(
                        false
                    );

                }

            };

        loadSession();

    }, []);

    /* ========================================
       LOGIN
    ======================================== */

    const signIn =
        useCallback(
            async (
                login: string,
                password: string
            ): Promise<AuthUser> => {

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
                    response.user.role.toUpperCase();

                if (
                    !ALLOWED_ROLES.includes(
                        role
                    )
                ) {

                    authService.logout();

                    throw new Error(
                        'Sem permissão.'
                    );

                }

                let profile:
                    | UserDetails
                    | undefined;

                try {

                    const userResponse =
                        await userService.findById(
                            response.user.id
                        );

                    if (
                        userResponse.success &&
                        userResponse.user
                    ) {

                        profile =
                            userResponse.user;

                        localStorage.setItem(
                            '@App:userName',
                            profile.name
                        );

                    }

                } catch {
                    //
                }

                const authUser: AuthUser = {
                    id:
                        response.user.id,

                    role:
                        response.user.role,

                    access_token:
                        response.user
                            .access_token,

                    refresh_token:
                        response.user
                            .refresh_token,

                    profile,
                };

                setUser(
                    authUser
                );

                return authUser;

            },
            []
        );

    /* ========================================
       LOGOUT
    ======================================== */

    const signOut =
        useCallback(
            () => {

                authService.logout();

                setSelectedPanel(
                    null
                );

                setUser(
                    null
                );

            },
            [
                setSelectedPanel
            ]
        );

    /* ========================================
       CONTEXT
    ======================================== */

    const value =
        useMemo(
            () => ({
                user,

                loading,

                authenticated:
                    !!user,

                selectedPanel,

                setSelectedPanel,

                signIn,

                signOut,

                updateSession,
            }),
            [
                user,
                loading,
                selectedPanel,
                signIn,
                signOut,
                setSelectedPanel,
                updateSession,
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

export const useAuth =
    () =>
        useContext(
            AuthContext
        );