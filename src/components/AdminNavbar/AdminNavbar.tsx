import { useMemo } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

import "./AdminNavbar.css";

export const AdminNavbar = () => {
    const navigate = useNavigate();

    const { signOut } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const userName = useMemo(() => {
        return (
            localStorage.getItem("@App:userName") ||
            "Administrador"
        );
    }, []);

    const firstLetter =
        userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        signOut();
        navigate("/login");
    };

    return (
        <header className="admin-navbar">

            <div className="admin-navbar-left">

                <div className="admin-brand-texts">

                    <span className="admin-brand-label">
                        Sistema Administrativo
                    </span>

                    <h1 className="admin-brand-title">
                        Painel Administrativo
                    </h1>

                </div>

            </div>

            <div className="admin-navbar-right">
                <button 
                    onClick={toggleTheme} 
                    className="admin-theme-toggle"
                    title="Alternar tema"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', color: 'var(--text-muted)' }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="admin-user-wrapper">

                    <button className="admin-user">

                        <div className="admin-user-info">

                            <span className="admin-user-name">
                                {userName}
                            </span>

                            <span className="admin-user-role">
                                Administrador
                            </span>

                        </div>

                        <div className="admin-avatar">
                            {firstLetter}
                        </div>

                        <ChevronDown
                            size={16}
                            className="admin-user-chevron"
                        />

                    </button>

                    <div className="admin-user-dropdown">

                        <button
                            className="admin-dropdown-item logout"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>

                    </div>

                </div>

            </div>

        </header>
    );
};