import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import NavBar from './components/layout/NavBar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardChild from './pages/DashboardChild';
import DashboardTeen from './pages/DashboardTeen';
import DashboardAdult from './pages/DashboardAdult';
import DashboardSenior from './pages/DashboardSenior';
import Tasks from './pages/Tasks';
import Timer from './pages/Timer';
import Rewards from './pages/Rewards';
import Memory from './pages/Memory';
import Achievements from './pages/Achievements';
import Clipboard from './pages/Clipboard';
import Guidance from './pages/Guidance';
import Streak from './pages/Streak';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/auth/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: { main: '#667eea', light: '#8c9eff', dark: '#4a56b8' },
    secondary: { main: '#764ba2', light: '#a679d2', dark: '#543482' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.08)',
    '0 8px 16px rgba(0,0,0,0.1)',
    '0 12px 24px rgba(0,0,0,0.12)',
    '0 16px 32px rgba(0,0,0,0.15)',
  ],
});

function DashboardRedirect() {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  const ageGroup = user?.ageGroup || 'adult';
  return <Navigate to={`/dashboard/${ageGroup}`} replace />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/dashboard/child" element={<PrivateRoute><DashboardChild /></PrivateRoute>} />
        <Route path="/dashboard/teen" element={<PrivateRoute><DashboardTeen /></PrivateRoute>} />
        <Route path="/dashboard/adult" element={<PrivateRoute><DashboardAdult /></PrivateRoute>} />
        <Route path="/dashboard/senior" element={<PrivateRoute><DashboardSenior /></PrivateRoute>} />
        
        {/* Feature Routes */}
        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
        <Route path="/timer" element={<PrivateRoute><Timer /></PrivateRoute>} />
        <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
        <Route path="/memory" element={<PrivateRoute><Memory /></PrivateRoute>} />
        <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
        <Route path="/clipboard" element={<PrivateRoute><Clipboard /></PrivateRoute>} />
        <Route path="/guidance" element={<PrivateRoute><Guidance /></PrivateRoute>} />
        <Route path="/streak" element={<PrivateRoute><Streak /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
