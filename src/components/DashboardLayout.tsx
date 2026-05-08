import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ShieldCheck, Map } from 'lucide-react'; // Importado Map
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('@App:userName') || "Usuário"; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <ShieldCheck size={24} color="#469472" />
          <span>GeoSaúde</span>
        </div>

        <nav className="nav-menu">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          
          {/* Novo Link para o Mapa de Calor */}
          <NavLink 
            to="/heatmap" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <Map size={18} /> Mapa de Calor
          </NavLink>
        </nav>

        <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
          <button onClick={handleLogout} className="btn-logout-sidebar">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <span className="header-system-title">SUPERVISÃO EPIDEMIOLÓGICA</span>
          <div className="header-user-info">
            <div className="user-text">
              <p className="user-name">{userName}</p>
              <p className="user-role">Administrador</p>
            </div>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};