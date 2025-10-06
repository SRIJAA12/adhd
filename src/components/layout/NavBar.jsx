import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function NavBar() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'primary.main', mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          <span role="img" aria-label="Brain" style={{ marginRight: 8 }}>🧠</span> NeuroFlow Suite
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button component={NavLink} to="/" sx={({ isActive }) => ({ color: isActive ? '#764ba2' : '#667eea' })}>Home</Button>
          <Button component={NavLink} to="/dashboard/adult" sx={({ isActive }) => ({ color: isActive ? '#764ba2' : '#667eea' })}>Dashboard</Button>
          <Button component={NavLink} to="/tasks" sx={({ isActive }) => ({ color: isActive ? '#764ba2' : '#667eea' })}>Tasks</Button>
          <Button component={NavLink} to="/timer" sx={({ isActive }) => ({ color: isActive ? '#764ba2' : '#667eea' })}>Time</Button>
          <Button component={NavLink} to="/rewards" sx={({ isActive }) => ({ color: isActive ? '#764ba2' : '#667eea' })}>Rewards</Button>
          <Button component={NavLink} to="/memory" sx={({ isActive }) => ({ color: isActive ? '#764ba2' : '#667eea' })}>Memory</Button>
        </Box>
        {!isAuthenticated && (
          <Button component={NavLink} to="/login" sx={{ ml: 2 }} variant="contained">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
