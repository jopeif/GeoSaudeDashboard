// src/App.tsx

import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  type ReactElement
} from 'react';

import { LoginPage } from './pages/login/LoginPage';

import { DashboardLayout } from './components/Layouts/DashboardLayout/DashboardLayout';

import { DashboardHome } from './pages/DashboardHome/DashboardHome';
import { HeatmapPage } from './pages/Heatmap/HeatmapPage';
import { AgentsActivityPage } from './pages/AgentActivityPage/AgentActivityPage';
import { AgentDetails } from './pages/AgentDetails/AgentDetails';


import { AdminHome } from './pages/Admin/AdminHome/AdminHome';

import { AdminRoute } from './routes/AdminRoutes';

import { useAuth } from './contexts/AuthContext';
import { AdminLayout } from './components/Layouts/AdminLayout/AdminLayout';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { VisitDetailsPage } from './pages/VisitDetailPage.tsx/VisitDetailsPage';
import { NewVisitPage } from './pages/NewVisitPage/NewVisitPage';

interface ProtectedRouteProps {
  children: ReactElement;
}

/* ========================================
   PRIVATE ROUTE
======================================== */

const ProtectedRoute = ({
  children
}: ProtectedRouteProps) => {

  const {
    authenticated,
    loading
  } = useAuth();

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
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

/* ========================================
   PUBLIC ROUTE
======================================== */

const PublicRoute = ({
  children
}: ProtectedRouteProps) => {

  const {
    authenticated,
    loading,
    user,
    selectedPanel
  } = useAuth();

  if (loading) {
    return null;
  }

  if (authenticated) {

    const role =
      user?.role
        ?.toUpperCase();

    const isAdmin =
      role === 'ADM' ||
      role === 'ADMIN' ||
      role === 'SUPERADMIN';

    /*
      Admin autenticado sem painel escolhido:
      mantém na tela de login
      para o modal aparecer
    */
    if (
      isAdmin &&
      !selectedPanel
    ) {
      return children;
    }

    /*
      Admin com painel escolhido
    */
    if (
      selectedPanel === 'admin'
    ) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    /*
      Supervisor ou admin no painel supervisor
    */
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

/* ========================================
   APP
======================================== */

function App() {

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={
            <DashboardHome />
          }
        />

        <Route
          path="heatmap"
          element={
            <HeatmapPage />
          }
        />

        <Route
          path="new-visit"
          element={
            <NewVisitPage />
          }
        />

        <Route
          path="agent"
          element={
            <AgentsActivityPage />
          }
        />

        <Route
          path="agents/:id"
          element={
            <AgentDetails />
          }
        />

        <Route
          path="visit/:id"
          element={
            <VisitDetailsPage />
          }
        />

        <Route
          path="profile"
          element={
            <ProfilePage />
          }
        />

      </Route>

      {/* ADMIN */}
      {/* ADMIN */}
      <Route element={<AdminRoute />}>

          <Route
              path="/admin"
              element={<AdminLayout />}
          >

              <Route
                  index
                  element={<AdminHome />}
              />

              {/* futuras páginas */}

              {/* /admin/users */}
              {/* /admin/logs */}
              {/* /admin/settings */}

          </Route>

      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;