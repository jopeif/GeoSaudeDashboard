// src/components/AdminLayout.tsx

import { Outlet } from 'react-router-dom';

import { AdminNavbar } from '../../AdminNavbar/AdminNavbar';

import './AdminLayout.css';

export const AdminLayout = () => {

    return (
        <div className="admin-layout">

            <AdminNavbar />

            <main className="admin-content">
                <Outlet />
            </main>

        </div>
    );
};