import React, { useState } from 'react';
import { Box, Grid, Avatar, Typography, Card, CardActionArea, CardContent, Fab, Badge } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import AIChatbot from '../components/dashboard/AIChatbot';

const ageThemes = {
  child: {
    bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    icon: "🧒",
    quote: "Every small step is a big achievement!",
    hero: "young explorer",
  },
  teen: {
    bg: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    icon: "🚀",
    quote: "Your creativity and focus can change the world.",
    hero: "innovative creator",
  },
  adult: {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: "💼",
    quote: "Focus on progress, not perfection.",
    hero: "focused achiever",
  },
  senior: {
    bg: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
    icon: "🌟",
    quote: "Your wisdom and experience are invaluable.",
    hero: "wise mentor",
  }
};

const features = [
  { label: 'Tasks', route: '/tasks', icon: '📝', color: '#667eea', description: 'Manage your daily tasks' },
  { label: 'Focus Timer', route: '/timer', icon: '⏲️', color: '#764ba2', description: 'Pomodoro & time tracking' },
  { label: 'Rewards', route: '/rewards', icon: '🏆', color: '#10b981', description: 'Your achievements & badges' },
  { label: 'Memory Games', route: '/memory', icon: '🧠', color: '#f59e0b', description: 'Cognitive exercises' },
  { label: 'Progress', route: '/achievements', icon: '📈', color: '#06b6d4', description: 'Track your growth' },
  { label: 'Smart Notes', route: '/clipboard', icon: '📋', color: '#8b5cf6', description: 'Cognitive clipboard' },
  { label: 'Guidance', route: '/guidance', icon: '🦉', color: '#ef4444', description: 'Task breakdown helper' },
  { label: 'Streak', route: '/streak', icon: '🔥', color: '#f97316', description: 'Daily consistency' }
];

export default function ThemedDashboard({ ageGroup }) {
  const user = useSelector((state) => state.user.user);
  
  // FIXED: Safely extract primitive values with fallbacks
  const gamificationState = useSelector((state) => state.gamification);
  
  // Convert to number and provide defaults
  const totalPoints = Number(gamificationState?.totalPoints) || 190;
  const currentStreak = Number(gamificationState?.currentStreak) || 0;
  
  const navigate = useNavigate();
  const theme = ageThemes[ageGroup] || ageThemes.adult;
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', pb: 4 }}>
      {/* Hero Section */}
      <Box sx={{
        mb: 4,
        p: 4,
        borderRadius: 4,
        background: theme.bg,
        boxShadow: '0 8px 32px rgba(102,126,234,0.15)',
        mx: 3,
        mt: 3
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar 
              src={user?.avatar} 
              sx={{ 
                width: 100, 
                height: 100, 
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {theme.icon}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>
              Welcome back, {user?.name || 'User'}! {theme.icon}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, mb: 1 }}>
              You're our {theme.hero}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
              "{theme.quote}"
            </Typography>
          </Grid>
          <Grid item>
            <Box display="flex" gap={3}>
              {/* Points Display - FIXED */}
              <Box textAlign="center" sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                backdropFilter: 'blur(10px)',
                p: 2, 
                borderRadius: 3,
                minWidth: 100
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                  {totalPoints}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  Points
                </Typography>
              </Box>
              
              {/* Streak Display - FIXED */}
              <Box textAlign="center" sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                backdropFilter: 'blur(10px)',
                p: 2, 
                borderRadius: 3,
                minWidth: 100
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fbbf24' }}>
                  {currentStreak} 🔥
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  Day Streak
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Feature Cards Grid */}
      <Box sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
          Your Tools
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={feature.label}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '2px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderColor: feature.color
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(feature.route)} sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          bgcolor: feature.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          mr: 2
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {feature.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AI Chatbot FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5568d3 0%, #63408d 100%)',
          }
        }}
        onClick={() => setChatOpen(true)}
      >
        <Badge badgeContent="AI" color="error">
          <ChatIcon sx={{ fontSize: 32 }} />
        </Badge>
      </Fab>

      {/* AI Chatbot Drawer */}
      <AIChatbot open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  );
}
