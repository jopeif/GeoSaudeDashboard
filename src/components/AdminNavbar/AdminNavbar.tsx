import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

import './AdminNavbar.css';

import logo from "../../imgs/logo.png"

export const AdminNavbar = () => {

    const navigate =
        useNavigate();

    const {
        signOut
    } = useAuth();


    const handleLogout =
        () => {

            signOut();

            navigate(
                '/login'
            );
        };


    const handleBackToSupervisor =
        () => {

            navigate(
                '/dashboard'
            );
        };


    return (
        <nav
            className="admin-navbar"
        >

            <div
                className="admin-navbar-left"
            >

                <img src={logo} />

                <h2>
                    Painel Administrativo
                </h2>

            </div>


            <div
                className="admin-navbar-actions"
            >

                <button
                    className="admin-nav-btn secondary"
                    onClick={
                        handleBackToSupervisor
                    }
                >

                    <LayoutDashboard
                        size={16}
                    />

                    Supervisor

                </button>


                <button
                    className="admin-nav-btn danger"
                    onClick={
                        handleLogout
                    }
                >

                    <LogOut
                        size={16}
                    />

                    Sair

                </button>

            </div>

        </nav>
    );
};