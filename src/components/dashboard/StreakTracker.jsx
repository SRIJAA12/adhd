import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const StreakTracker = () => {
  const { currentStreak, longestStreak, streakDays } = useSelector(
    (state) => state.gamification
  );

  // Generate last 7 days for demo
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed: i < currentStreak,
    };
  });

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        🔥 Streak Tracker
      </Typography>

      {/* Current Streak Display */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            {currentStreak}
          </Typography>
        </motion.div>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Day Streak
        </Typography>
      </Box>

      {/* Visual Chain */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {last7Days.map((day, index) => (
            <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {day.date}
              </Typography>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: day.completed ? 'success.main' : 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'white',
                    mt: 0.5,
                    mx: 'auto',
                    boxShadow: day.completed ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                  }}
                >
                  {day.completed ? '✓' : ''}
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Best Streak */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'rgba(245, 158, 11, 0.1)',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Your Best Streak
        </Typography>
        <Typography variant="h5" color="warning.main" sx={{ fontWeight: 700 }}>
          {longestStreak} days 🏆
        </Typography>
      </Box>

      {/* Motivation Message */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {currentStreak === 0 && "Start your streak today! 🚀"}
          {currentStreak > 0 && currentStreak < 3 && "You're on fire! Keep it up! 🔥"}
          {currentStreak >= 3 && currentStreak < 7 && "Amazing consistency! 💪"}
          {currentStreak >= 7 && "You're a productivity champion! 🏆"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StreakTracker;
