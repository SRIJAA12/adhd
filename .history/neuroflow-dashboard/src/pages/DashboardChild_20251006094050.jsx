import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import ThemedDashboard from './ThemedDashboard';

export default function DashboardChild() {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1}>
        <ThemedDashboard ageGroup="child" />
      </Box>
    </Box>
  );
}
