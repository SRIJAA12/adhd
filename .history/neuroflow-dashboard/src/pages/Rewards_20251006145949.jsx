import React from 'react';
import { Container, Box } from '@mui/material';
import RewardsPanel from '../components/dashboard/RewardsPanel';
import Sidebar from '../components/layout/Sidebar';

export default function Rewards() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <RewardsPanel />
      </Container>
    </Box>
  );
}
