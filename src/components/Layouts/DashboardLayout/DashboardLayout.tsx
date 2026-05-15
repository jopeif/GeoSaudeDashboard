// src/layouts/DashboardLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../Sidebar/Sidebar';
import { Navbar } from '../../Navbar/Navbar';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      
      <div className="main-viewport">
        <Navbar onLogout={handleLogout}/>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};