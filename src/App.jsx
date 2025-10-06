import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import FaceLogin from './pages/FaceLogin';
import FaceSignup from './pages/FaceSignup';
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
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
  },
});

function App() {
  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated || false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/face-login" element={<FaceLogin />} />
        <Route path="/face-signup" element={<FaceSignup />} />
        
        {/* Root redirect */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard/adult" /> : 
            <Navigate to="/login" />
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/child"
          element={
            <PrivateRoute>
              <DashboardChild />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/teen"
          element={
            <PrivateRoute>
              <DashboardTeen />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/adult"
          element={
            <PrivateRoute>
              <DashboardAdult />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/senior"
          element={
            <PrivateRoute>
              <DashboardSenior />
            </PrivateRoute>
          }
        />

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
