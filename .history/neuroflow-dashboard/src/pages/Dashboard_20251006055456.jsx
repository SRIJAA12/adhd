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
import RoutinePlanner from '../components/dashboard/RoutinePlanner';


const ageThemes = {
  child: {
    bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    hero: "young explorer",
    icon: "🧑‍🚀",
    quote: "Small steps lead to big adventures!"
  },
  teen: {
    bg: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    hero: "creative star",
    icon: "🚀",
    quote: "Dream big and turn ideas into actions."
  },
  adult: {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    hero: "focused achiever",
    icon: "✅",
    quote: "The best way out is always through."
  },
  senior: {
    bg: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
    hero: "wise mentor",
    icon: "🌟",
    quote: "Your experience is your superpower."
  }
};

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const { totalPoints, currentStreak } = useSelector((state) => state.gamification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userTheme = ageThemes[user?.ageGroup] || {
    bg: "#f5f7fa",
    hero: "friend",
    icon: "👋",
    quote: "Let's make today productive and manageable."
  };

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
          <Box sx={{ display: 'flex', gap: 3, mr: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Points</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>{totalPoints}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Streak</Typography>
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>{currentStreak} 🔥</Typography>
            </Box>
          </Box>
          <Avatar src={user?.avatar} sx={{ bgcolor: 'primary.main', mr: 2, fontWeight: 600 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Button variant="outlined" size="small" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Personalized Hero Area */}
      <Box sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        background: userTheme.bg,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)'
      }}>
        <Avatar src={user?.avatar} sx={{
          width: 76, height: 76, mr: 2, fontSize: 40, bgcolor: 'white', border: '2px solid #667eea'
        }}>
          {userTheme.icon}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {userTheme.icon} Welcome, {user?.name}{user?.pronouns ? ` (${user.pronouns})` : ''}!
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 500 }}>
            You’re our {userTheme.hero}.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {userTheme.quote}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <TaskManager />
            <RewardsPanel />
            <Box sx={{ mt: 3 }}>
              <TaskGuidance />
            </Box>
          </Grid>
          {/* Sidebar */}
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
