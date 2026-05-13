// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';

import { LoginPage } from './pages/login/LoginPage';

import { DashboardLayout } from './components/DashboardLayout';

import { DashboardHome } from './pages/DashboardHome/DashboardHome';
import { HeatmapPage } from './pages/Heatmap/HeatmapPage';
import { NewVisitPage } from './pages/NewVisitPage/NewVisitPage';
import { AgentsActivityPage } from './pages/AgentActivityPage/AgentActivityPage';
import { AgentDetails } from './pages/AgentDetails/AgentDetails';
import { VisitDetailsPage } from './pages/VisitDetailPage.tsx/VisitDetailsPage';

import { useAuth } from './contexts/AuthContext';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#64748b',
          background: '#f8fafc'
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* ROTAS PRIVADAS */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<DashboardHome />} />

        <Route path="heatmap" element={<HeatmapPage />} />

        <Route path="new-visit" element={<NewVisitPage />} />

        <Route path="agent" element={<AgentsActivityPage />} />

        <Route path="agents/:id" element={<AgentDetails />} />

        <Route path="visit/:id" element={<VisitDetailsPage />} />
        
        <Route path="/profile" element={<ProfilePage/>}/>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;