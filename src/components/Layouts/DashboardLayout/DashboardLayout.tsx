import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../Sidebar/Sidebar';
import { Navbar } from '../../Navbar/Navbar';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="main-viewport">
        <Navbar 
          onLogout={handleLogout} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};