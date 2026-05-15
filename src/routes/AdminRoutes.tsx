import {
    Navigate,
    Outlet
} from 'react-router-dom';

import {
    useAuth
} from '../contexts/AuthContext';

export const AdminRoute = () => {

    const { user } =
        useAuth();

    const role =
        user?.role
        ?.toUpperCase();

    const isAdmin =
        role === 'ADMIN' ||
        role === 'SUPERADMIN' ||
        role === 'ADM';

    if (!isAdmin) {
        return (
        <Navigate
            to="/dashboard"
            replace
        />
        );
    }

    return <Outlet />;
};