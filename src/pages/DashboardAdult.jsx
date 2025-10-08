import React, { Suspense } from 'react';
import { Box, Button } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import ThemedDashboard from './ThemedDashboard';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

// Lazy load avatar to prevent blocking
const TalkingAvatar = React.lazy(() => import('../components/dashboard/TalkingAvatar'));

export default function DashboardAdult() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1}>
        {/* Logout button at the top right of the dashboard area */}
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <ThemedDashboard ageGroup="adult" />
      </Box>
      {/* Talking Avatar - appears on all pages */}
      <Suspense fallback={null}>
        <TalkingAvatar />
      </Suspense>
    </Box>
  );
}
