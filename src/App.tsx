import { Routes, Route, Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';
import { LoginPage } from './pages/login/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome/DashboardHome';

// Componente simples para proteger as rotas
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = localStorage.getItem('@App:token');
  
  if (!token) {
    // Se não houver token, manda de volta para o login
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Privadas (Envolvidas pelo Layout e Proteção) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Rota padrão ao entrar no sistema */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        
        {/* Outras rotas administrativas virão aqui */}
        {/* <Route path="relatorios" element={<ReportsPage />} /> */}
      </Route>

      {/* Redirecionamento de rotas inexistentes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;