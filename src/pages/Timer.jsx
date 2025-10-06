import React from 'react';
import { Container, Box } from '@mui/material';
import PomodoroTimer from '../components/dashboard/PomodoroTimer';
import Sidebar from '../components/layout/Sidebar';

export default function Timer() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PomodoroTimer />
      </Container>
    </Box>
  );
}
