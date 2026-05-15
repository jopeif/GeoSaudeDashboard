// src/components/layout/Navbar.tsx

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  User,
  ChevronDown,
  //SearchX
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

import './Navbar.css';


interface NavbarProps {
    onLogout: () => void;
}

export const Navbar = ({onLogout}:NavbarProps) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const userName = useMemo(() => {
    return (
      localStorage.getItem('@App:userName') ||
      'Usuário'
    );
  }, []);

  const firstLetter =
    userName.charAt(0).toUpperCase();

  const formattedRole = useMemo(() => {
    const role =
      user?.role ||
      localStorage.getItem('@App:role') ||
      'SUPERVISOR';

    switch (role.toUpperCase()) {
      case 'SUPERADMIN':
        return 'Super Administrador';

      case 'ADMIN':
        return 'Administrador';

      case 'SUPERVISOR':
        return 'Supervisor';

      default:
        return role;
    }
  }, [user]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <div className="brand-texts">
          <span className="brand-label">
            Sistema de Supervisão
          </span>

          <h1 className="brand-title">
            Supervisão Epidemiológica
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        

        {/* USER */}
        <div className="navbar-user-wrapper">
          <button className="navbar-user">
            <div className="navbar-user-info">
              <span className="navbar-user-name">
                {userName}
              </span>

              <span className="navbar-user-role">
                {formattedRole}
              </span>
            </div>

            <div className="navbar-avatar">
              {firstLetter || <User size={18} />}
            </div>

            <ChevronDown
              size={16}
              className="navbar-user-chevron"
            />
          </button>

          <div className="navbar-user-dropdown">
            <button
              onClick={handleGoToProfile}
              className="navbar-dropdown-item"
            >
              Perfil
            </button>

            <button
              className="navbar-dropdown-item logout"
              onClick={onLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};