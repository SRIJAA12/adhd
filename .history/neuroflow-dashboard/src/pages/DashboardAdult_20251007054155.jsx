import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import ThemedDashboard from './ThemedDashboard';

import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return <button onClick={handleLogout}>Logout</button>;
}


export default function DashboardAdult() {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1}>
        <ThemedDashboard ageGroup="adult" />
      </Box>
    </Box>
  );
}
