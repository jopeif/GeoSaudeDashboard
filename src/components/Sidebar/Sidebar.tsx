// src/components/layout/Sidebar.tsx

import { Link, NavLink } from 'react-router-dom';

import {
    LayoutDashboard,
    Map,
    User,
    ChevronRight,
    Shield
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

import logo from "../../imgs/logo.png";

import './Sidebar.css';

const navItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard
    },
    {
        label: 'Mapa de Calor',
        path: '/heatmap',
        icon: Map
    },
    {
        label: 'Atividade dos Agentes',
        path: '/agent',
        icon: User
    }
];

export const Sidebar = () => {

    const { user } = useAuth();

    const isAdmin =
        user?.role === 'ADMIN' ||
        user?.role === 'ADM' ||
        user?.role === 'SUPERADMIN';

    return (
        <aside className="sidebar">

            {/* HEADER */}
            <div className="sidebar-header">

                <div className="sidebar-brand">

                    <img
                        src={logo}
                        alt="GeoSaúde"
                        className="sidebar-logo"
                    />

                    <div className="sidebar-brand-texts">

                        <span className="sidebar-brand-label">
                            Plataforma
                        </span>

                        <h1 className="sidebar-brand-name">
                            GeoSaúde
                        </h1>

                    </div>

                </div>

            </div>

            {/* NAV */}
            <nav className="sidebar-nav">

                <span className="sidebar-section-title">
                    Navegação
                </span>

                <div className="sidebar-links">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'sidebar-link active'
                                        : 'sidebar-link'
                                }
                            >

                                <div className="sidebar-link-left">

                                    <div className="sidebar-icon-wrapper">
                                        <Icon size={18} />
                                    </div>

                                    <span>
                                        {item.label}
                                    </span>

                                </div>

                                <ChevronRight
                                    size={16}
                                    className="sidebar-link-arrow"
                                />

                            </NavLink>
                        );
                    })}

                </div>

            </nav>

            {/* ADMIN ACCESS */}
            {isAdmin && (

                <Link
                    to="/admin"
                    className="sidebar-admin-link"
                >

                    <div className="sidebar-footer">

                        <button className="sidebar-logout-btn admin-access-btn">

                            <Shield size={16} />

                            <span>
                                Acessar painel administrativo
                            </span>

                        </button>

                    </div>

                </Link>

            )}

        </aside>
    );
};