import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardChild from './pages/DashboardChild';
import DashboardTeen from './pages/DashboardTeen';
import DashboardAdult from './pages/DashboardAdult';
import DashboardSenior from './pages/DashboardSenior';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/auth/PrivateRoute';
import { useSelector } from 'react-redux';
import NavBar from './components/layout/NavBar';

const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  shape: { borderRadius: 8 },
});

function DashboardRedirect() {
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;
  switch (user?.ageGroup) {
    case 'child': return <Navigate to="/dashboard/child" />;
    case 'teen': return <Navigate to="/dashboard/teen" />;
    case 'adult': return <Navigate to="/dashboard/adult" />;
    case 'senior': return <Navigate to="/dashboard/senior" />;
    default: return <Navigate to="/dashboard/adult" />;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Routes>
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/child" element={<PrivateRoute><DashboardChild /></PrivateRoute>} />
        <Route path="/dashboard/teen" element={<PrivateRoute><DashboardTeen /></PrivateRoute>} />
        <Route path="/dashboard/adult" element={<PrivateRoute><DashboardAdult /></PrivateRoute>} />
        <Route path="/dashboard/senior" element={<PrivateRoute><DashboardSenior /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
