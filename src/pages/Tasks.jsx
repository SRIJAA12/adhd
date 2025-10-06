import React from 'react';
import { Container, Box } from '@mui/material';
import TaskManager from '../components/dashboard/TaskManager';
import Sidebar from '../components/layout/Sidebar';

export default function Tasks() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <TaskManager />
      </Container>
    </Box>
  );
}
