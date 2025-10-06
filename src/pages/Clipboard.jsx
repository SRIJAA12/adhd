import React from 'react';
import { Container, Box } from '@mui/material';
import CognitiveClipboard from '../components/dashboard/CognitiveClipboard';
import Sidebar from '../components/layout/Sidebar';

export default function Clipboard() {
  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CognitiveClipboard />
      </Container>
    </Box>
  );
}
