// src/layouts/DashboardLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <div className="main-viewport">
        <Navbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};