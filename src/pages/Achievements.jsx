import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, LinearProgress, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first task', icon: '🎯', progress: 100, unlocked: true },
  { id: 2, title: 'Task Master', description: 'Complete 10 tasks', icon: '📝', progress: 70, unlocked: false },
  { id: 3, title: 'Centurion', description: 'Complete 100 tasks', icon: '👑', progress: 23, unlocked: false },
  { id: 4, title: 'Week Warrior', description: 'Maintain 7-day streak', icon: '🔥', progress: 60, unlocked: false },
  { id: 5, title: 'Focus Master', description: 'Complete 20 Pomodoro sessions', icon: '⏲️', progress: 85, unlocked: false },
  { id: 6, title: 'Memory Champion', description: 'Win 10 memory games', icon: '🧠', progress: 40, unlocked: false },
];

export default function Achievements() {
  const user = useSelector((state) => state.user.user);
  const gamificationState = useSelector((state) => state.gamification);
  
  // Use user's points from database
  const totalPoints = Number(user?.points) || 0;
  const currentStreak = Number(gamificationState?.currentStreak) || 0;

  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            <EmojiEventsIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
            Your Achievements
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your progress and unlock new badges
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700}>{totalPoints}</Typography>
                <Typography variant="body2">Total Points</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700}>{currentStreak} 🔥</Typography>
                <Typography variant="body2">Day Streak</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" fontWeight={700}>
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </Typography>
                <Typography variant="body2">Achievements Unlocked</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Achievement Cards */}
        <Grid container spacing={3}>
          {achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card sx={{ 
                height: '100%',
                opacity: achievement.unlocked ? 1 : 0.7,
                border: achievement.unlocked ? '2px solid #10b981' : '1px solid #e5e7eb',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h2" mr={2}>{achievement.icon}</Typography>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={700}>
                        {achievement.title}
                      </Typography>
                      {achievement.unlocked && (
                        <Chip label="Unlocked" color="success" size="small" />
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {achievement.description}
                  </Typography>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" fontWeight={600}>{achievement.progress}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={achievement.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
