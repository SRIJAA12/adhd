import React from 'react';
import { Box, Grid, AppBar, Toolbar, Typography, Avatar, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';
import RewardsPanel from '../components/dashboard/RewardsPanel';
import StreakTracker from '../components/dashboard/StreakTracker';
import CognitiveClipboard from '../components/dashboard/CognitiveClipboard';
import TaskGuidance from '../components/dashboard/TaskGuidance';
import TaskManager from '../components/dashboard/TaskManager';

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const { totalPoints, currentStreak } = useSelector((state) => state.gamification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Top Navigation */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.main' }}>
            ⚡ NeuroFlow Dashboard
          </Typography>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 3, mr: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Points
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                {totalPoints}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Streak
              </Typography>
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>
                {currentStreak} 🔥
              </Typography>
            </Box>
          </Box>

          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              fontWeight: 600,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>

          <Button variant="outlined" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let's make today productive and manageable
          </Typography>
        </Box>

        {/* Dashboard Grid */}
        <Grid container spacing={3}>
          {/* Main Left Column - Task Manager */}
          <Grid item xs={12} md={8}>
            <TaskManager />
            <RewardsPanel />
            <Box sx={{ mt: 3 }}>
              <TaskGuidance />
            </Box>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} md={4}>
            <StreakTracker />
            <Box sx={{ mt: 3 }}>
              <CognitiveClipboard />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
