import React from 'react';
import { Container, Box } from '@mui/material';
import StreakTracker from '../components/dashboard/StreakTracker';
import Sidebar from '../components/layout/Sidebar';

export default function Streak() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StreakTracker />
      </Container>
    </Box>
  );
}
