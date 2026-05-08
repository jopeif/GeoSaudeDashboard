// src/components/layout/Navbar.tsx
import { User } from 'lucide-react';

export const Navbar = () => {
  const userName = localStorage.getItem('@App:userName') || "Usuário";

  return (
    <header className="navbar-header">
      <div className="header-left">
        <h1 className="header-title">Supervisão Epidemiológica</h1>
      </div>

      <div className="header-right">
        
        <div className="user-profile">
          <div className="user-info-text">
            <span className="user-name">{userName}</span>
            <span className="user-role">Administrador</span>
          </div>
          <div className="avatar-circle">
            <User size={20} color="#64748b" />
          </div>
        </div>
      </div>
    </header>
  );
};