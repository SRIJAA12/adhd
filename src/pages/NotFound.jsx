import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box textAlign="center" py={14}>
      <Typography variant="h2" color="primary">404</Typography>
      <Typography variant="h6" color="text.secondary">Page Not Found</Typography>
    </Box>
  );
}
