import React from 'react';
import { Container, Box } from '@mui/material';
import MemoryGames from '../components/dashboard/MemoryGames';
import Sidebar from '../components/layout/Sidebar';

export default function Memory() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <MemoryGames />
      </Container>
    </Box>
  );
}
