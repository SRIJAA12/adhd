import React from 'react';
import { Box, Grid, Avatar, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent } from '@mui/material';

const ageThemes = {
  child: {
    bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    icon: "🧑‍🚀",
    quote: "Small steps lead to big adventures!",
  },
  teen: {
    bg: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    icon: "🚀",
    quote: "Dream big and turn ideas into actions.",
  },
  adult: {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: "✅",
    quote: "The best way out is always through.",
  },
  senior: {
    bg: "linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)",
    icon: "🌟",
    quote: "Your experience is your superpower.",
  }
};

const features = [
  { label: 'Tasks', route: '/tasks', icon: '📝' },
  { label: 'Timer', route: '/timer', icon: '⏲️' },
  { label: 'Rewards', route: '/rewards', icon: '🏆' },
  { label: 'Memory', route: '/memory', icon: '🧠' },
  { label: 'Achievements', route: '/achievements', icon: '📈' },
  { label: 'Clipboard', route: '/clipboard', icon: '📋' },
  { label: 'Guidance', route: '/guidance', icon: '🦉' },
  { label: 'Streak', route: '/streak', icon: '🔥' }
];

export default function ThemedDashboard({ ageGroup }) {
  const user = useSelector((state) => state.user.user);
  const { totalPoints, currentStreak } = useSelector((state) => state.gamification);
  const navigate = useNavigate();
  const theme = ageThemes[ageGroup] || ageThemes.adult;

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Box sx={{
        mb: 4, p: 3, borderRadius: 3, background: theme.bg, display: 'flex',
        alignItems: 'center', gap: 2, boxShadow: '0 8px 32px rgba(102,126,234,0.08)'
      }}>
        <Avatar src={user?.avatar} sx={{ width: 76, height: 76, mr: 2, fontSize: 40, bgcolor: 'white', border: '2px solid #667eea' }}>
          {theme.icon}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {theme.icon} Welcome, {user?.name} {user?.pronouns ? `(${user.pronouns})` : ''}
          </Typography>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 500 }}>
            You’re our {ageGroup}.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {theme.quote}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 3 }}>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">Points</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>{totalPoints}</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">Streak</Typography>
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>{currentStreak} 🔥</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {features.map(f => (
          <Grid item xs={12} sm={6} md={4} key={f.label}>
            <Card>
              <CardActionArea onClick={() => navigate(f.route)}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {f.icon} {f.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
