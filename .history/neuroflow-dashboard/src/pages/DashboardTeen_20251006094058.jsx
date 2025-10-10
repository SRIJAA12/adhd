import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import ThemedDashboard from './ThemedDashboard';

export default function DashboardTeen() {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1}>
        <ThemedDashboard ageGroup="teen" />
      </Box>
    </Box>
  );
}
