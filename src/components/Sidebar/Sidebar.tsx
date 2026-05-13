// src/components/layout/Sidebar.tsx

import { NavLink } from 'react-router-dom';

import {
    LayoutDashboard,
    LogOut,
    Map,
    User,
    Activity,
    ChevronRight
} from 'lucide-react';

import logo from "../../imgs/logo.png"

import './Sidebar.css';

interface SidebarProps {
    onLogout: () => void;
}

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

export const Sidebar = ({ onLogout }: SidebarProps) => {
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

                                    <span>{item.label}</span>
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

            {/* FOOTER */}
            <div className="sidebar-footer">
                {/* <div className="sidebar-status-card">
                    <div className="status-indicator" />

                    <div className="status-content">
                        <span className="status-label">
                            Sistema
                        </span>

                        <strong className="status-value">
                            Operacional
                        </strong>
                    </div>

                    <Activity
                        size={18}
                        className="status-icon"
                    />
                </div> */}

                <button
                    onClick={onLogout}
                    className="sidebar-logout-btn"
                >
                    <LogOut size={18} />
                    <span>Sair do Sistema</span>
                </button>
            </div>
        </aside>
    );
};