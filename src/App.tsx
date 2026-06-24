// import { MaintenancePage } from "./pages/MaintencePage/MaintencePage";

// function App() {

//   const maintenanceMode = true;

//   if (maintenanceMode) {
//     return <MaintenancePage />;
//   }
// }

// export default App;

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
import { LogsPage } from './pages/Admin/LogsPage/LogsPage';

import { AdminRoute } from './routes/AdminRoutes';

import { useAuth } from './contexts/AuthContext';
import { AdminLayout } from './components/Layouts/AdminLayout/AdminLayout';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { VisitDetailsPage } from './pages/VisitDetailPage.tsx/VisitDetailsPage';
import { NewVisitPage } from './pages/NewVisitPage/NewVisitPage';
import ReportsPage from './pages/ReportsPage/ReportsPage';

interface ProtectedRouteProps {
  children: ReactElement;
}

/* ========================================
   LOADING
======================================== */

const LoadingScreen = () => (
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

/* ========================================
   SUPERVISOR ROUTE
======================================== */

const SupervisorRoute = ({
  children
}: ProtectedRouteProps) => {

  const {
    authenticated,
    loading,
    user
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role =
    user?.role?.toUpperCase();

  const isAdmin =
    role === 'ADM' ||
    role === 'ADMIN' ||
    role === 'SUPERADMIN';

  if (isAdmin) {
    return (
      <Navigate
        to="/admin"
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
    user
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (authenticated) {

    const role =
      user?.role?.toUpperCase();

    const isAdmin =
      role === 'ADM' ||
      role === 'ADMIN' ||
      role === 'SUPERADMIN';

    return (
      <Navigate
        to={isAdmin ? '/admin' : '/dashboard'}
        replace
      />
    );
  }

  return children;
};

/* ========================================
   DEFAULT ROUTE
======================================== */

const DefaultRoute = () => {

  const {
    authenticated,
    loading,
    user
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role =
    user?.role?.toUpperCase();

  const isAdmin =
    role === 'ADM' ||
    role === 'ADMIN' ||
    role === 'SUPERADMIN';

  return (
    <Navigate
      to={isAdmin ? '/admin' : '/dashboard'}
      replace
    />
  );
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

      {/* SUPERVISOR */}

      <Route
        path="/"
        element={
          <SupervisorRoute>
            <DashboardLayout />
          </SupervisorRoute>
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
          path="reports"
          element={
            <ReportsPage />
          }
        />

        <Route
          path="agents"
          element={
            <AgentsActivityPage />
          }
        />

        <Route
          path="agent/:id"
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

      <Route
        element={<AdminRoute />}
      >

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<AdminHome />}
          />

          <Route
            path="logs"
            element={<LogsPage />}
          />

          {/* futuras páginas */}

          {/* /admin/users */}
          {/* /admin/settings */}

        </Route>

      </Route>

      {/* FALLBACK */}

      <Route
        path="*"
        element={<DefaultRoute />}
      />

    </Routes>
  );
}

export default App;