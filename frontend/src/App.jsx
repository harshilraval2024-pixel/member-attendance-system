import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

import { authStore } from './stores';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import MemberListPage from './pages/MemberListPage';
import MemberCreatePage from './pages/MemberCreatePage';
import MemberEditPage from './pages/MemberEditPage';
import MemberProfilePage from './pages/MemberProfilePage';
import AttendancePage from './pages/AttendancePage';
import LoginPage from './pages/LoginPage';

// FontAwesome library setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

// Protected Route wrapper
const ProtectedRoute = observer(({ children }) => {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
});

// Layout wrapper with Navbar
const Layout = ({ children }) => (
  <div className="min-vh-100" style={{ background: 'var(--gray-100)' }}>
    <Navbar />
    <main>{children}</main>
  </div>
);

const App = observer(() => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Layout><MemberListPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/new"
          element={
            <ProtectedRoute>
              <Layout><MemberCreatePage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:id"
          element={
            <ProtectedRoute>
              <Layout><MemberProfilePage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/:id/edit"
          element={
            <ProtectedRoute>
              <Layout><MemberEditPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Layout><AttendancePage /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
});

export default App;
