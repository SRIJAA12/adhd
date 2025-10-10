import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { clearRecentRewards } from '../../store/slices/gamificationSlice';
import soundManager from '../../utils/soundManager';

const RewardsPanel = () => {
  const { recentRewards, badges } = useSelector((state) => state.gamification);
  const dispatch = useDispatch();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (recentRewards.length > 0) {
      // Play celebration sound (will work once sound files are added)
      // soundManager.play('celebration');
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Clear old rewards after 10 seconds
      const timer = setTimeout(() => {
        dispatch(clearRecentRewards());
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [recentRewards, dispatch]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 1 }}
              animate={{ y: '100vh', rotate: 360 }}
              transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
              style={{
                position: 'absolute',
                fontSize: '24px',
              }}
            >
              {['🎉', '⭐', '🏆', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        🎉 Your Achievements
      </Typography>

      {/* Recent Rewards Animation */}
      <AnimatePresence>
        {recentRewards.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, x: 100 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <Box
              sx={{
                mb: 2,
                p: 2,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 2,
                color: 'white',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                +{reward.points} Points! 🎊
              </Typography>
              <Typography variant="body2">{reward.message}</Typography>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Badge Collection */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
        🏆 Badge Collection
      </Typography>
      <Grid container spacing={2}>
        {badges.map((badge) => (
          <Grid item xs={4} sm={3} md={2} key={badge.id}>
            <motion.div
              whileHover={{ scale: badge.unlocked ? 1.1 : 1 }}
              whileTap={{ scale: badge.unlocked ? 0.95 : 1 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  cursor: badge.unlocked ? 'pointer' : 'default',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: badge.unlocked ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  transition: 'all 0.3s',
                  '&:hover': badge.unlocked
                    ? {
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                      }
                    : {},
                }}
              >
                <Box
                  sx={{
                    fontSize: '3rem',
                    filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                    opacity: badge.unlocked ? 1 : 0.3,
                    transition: 'all 0.3s',
                  }}
                >
                  {badge.icon}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: badge.unlocked ? 600 : 400,
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  {badge.name}
                </Typography>
                {badge.unlocked && (
                  <Chip
                    label="Unlocked"
                    size="small"
                    color="success"
                    sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }}
                  />
                )}
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Progress Summary */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You've unlocked {badges.filter((b) => b.unlocked).length} out of {badges.length} badges!
        </Typography>
      </Box>
    </Paper>
  );
};

export default RewardsPanel;
