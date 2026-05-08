// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, ShieldCheck, Map } from 'lucide-react';

interface SidebarProps {
    onLogout: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
    return (
        <aside className="sidebar">
        <div className="sidebar-header">
            <div className="logo-container">
            <ShieldCheck size={28} color="#469472" fill="#46947220" />
            </div>
            <span className="brand-name">GeoSaúde</span>
        </div>

        <nav className="nav-menu">
            <p className="nav-section-title">Menu Principal</p>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} /> 
            <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/heatmap" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Map size={20} /> 
            <span>Mapa de Calor</span>
            </NavLink>
        </nav>

        <div className="sidebar-footer">
            <button onClick={onLogout} className="btn-logout-sidebar">
            <LogOut size={18} /> Sair do Sistema
            </button>
        </div>
        </aside>
    );
};