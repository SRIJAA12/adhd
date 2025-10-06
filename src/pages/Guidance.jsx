import React from 'react';
import { Container, Box } from '@mui/material';
import TaskGuidance from '../components/dashboard/TaskGuidance';
import Sidebar from '../components/layout/Sidebar';

export default function Guidance() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TaskGuidance />
      </Container>
    </Box>
  );
}
