import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MembersPage from './pages/MembersPage';
import StatisticsPage from './pages/StatisticsPage';
import ExportPage from './pages/ExportPage';
import AdminUsersPage from './pages/AdminUsersPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('mow-token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50">
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="pending" element={<MembersPage />} />
          <Route path="approved" element={<MembersPage />} />
          <Route path="rejected" element={<MembersPage />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
