import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Slider, Switch, FormControlLabel, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setTimerActive, setIntervalCount, setWorkDuration, setSoundPlaying, setFocusMode, resetTimer } from '../../store/slices/appSlice';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Howl } from 'howler';
import { addToGoogleCalendar } from '../../utils/calendarHelper';

// Ambient Sound
const ambientSound = new Howl({
  src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
  volume: 0.3,
  loop: true,
});

// Notification Sound
const notificationSound = new Howl({
  src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'],
  volume: 0.5,
});

// Urgency Bar Component - Green → Yellow → Red
function UrgencyBar({ intervalCount, workDuration }) {
  const remaining = Math.max(0, workDuration - intervalCount);
  const progress = ((workDuration - remaining) / workDuration) * 100;
  
  let barColor = '#10b981'; // Green
  if (remaining <= workDuration / 2 && remaining > workDuration / 4) {
    barColor = '#f59e0b'; // Yellow
  } else if (remaining <= workDuration / 4) {
    barColor = '#ef4444'; // Red
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Task Urgency
        </Typography>
        <Typography variant="caption" fontWeight={700} sx={{ color: barColor }}>
          {remaining > 0 ? `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')} remaining` : 'Complete!'}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 12,
          borderRadius: 6,
          backgroundColor: '#e5e7eb',
          '& .MuiLinearProgress-bar': {
            backgroundColor: barColor,
            transition: 'background-color 0.5s ease',
          }
        }}
      />
    </Box>
  );
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
    notificationSound.play();
  }
}

export default function PomodoroTimer() {
  const dispatch = useDispatch();
  const {
    timerActive,
    focusMode,
    soundPlaying,
    workDuration,
    intervalCount,
  } = useSelector((state) => state.app);

  const [sessionCount, setSessionCount] = useState(0);
  const [calendarAdded, setCalendarAdded] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      const updatedCount = intervalCount + 1;

      if (updatedCount >= workDuration) {
        sendNotification('🎉 Focus Session Complete!', 'Great work! Take a break.');
        dispatch(setTimerActive(false));
        dispatch(resetTimer());
        setSessionCount(prev => prev + 1);
      } else {
        dispatch(setIntervalCount(updatedCount));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, intervalCount, workDuration, dispatch]);

  // Ambient Sound Control
  useEffect(() => {
    if (soundPlaying) {
      ambientSound.play();
    } else {
      ambientSound.pause();
    }
  }, [soundPlaying]);

  const remainingSeconds = Math.max(0, workDuration - intervalCount);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  // Google Calendar Integration
  const handleAddToCalendar = () => {
    addToGoogleCalendar(Math.floor(workDuration / 60));
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        ⏲️ Focus Timer
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Pomodoro technique to stay focused and productive
      </Typography>

      {calendarAdded && (
        <Alert severity="success" icon={<EventAvailableIcon />} sx={{ mb: 2 }}>
          Calendar event created! Check Google Calendar.
        </Alert>
      )}

      {/* Urgency Bar with Color Coding */}
      <UrgencyBar intervalCount={intervalCount} workDuration={workDuration} />

      {/* Timer Display */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          mb: 3,
          boxShadow: '0 8px 24px rgba(102,126,234,0.3)'
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
          Sessions today: {sessionCount}
        </Typography>
      </Box>

      {/* Controls */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={timerActive ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={() => dispatch(setTimerActive(!timerActive))}
          sx={{
            py: 1.5,
            background: timerActive ? '#ef4444' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 700,
            '&:hover': {
              background: timerActive ? '#dc2626' : 'linear-gradient(135deg, #5568d3 0%, #63408d 100%)',
            }
          }}
        >
          {timerActive ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<RestartAltIcon />}
          onClick={() => dispatch(resetTimer())}
          sx={{ py: 1.5 }}
        >
          Reset
        </Button>
      </Box>

      {/* Duration Slider - Changed min to 1 */}
      <Box mb={3}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Work Duration: {Math.floor(workDuration / 60)} minutes
        </Typography>
        <Slider
          value={workDuration / 60}
          onChange={(e, value) => dispatch(setWorkDuration(value * 60))}
          min={1}
          max={60}
          step={1}
          marks={[
            { value: 1, label: '1m' },
            { value: 15, label: '15m' },
            { value: 25, label: '25m' },
            { value: 45, label: '45m' },
            { value: 60, label: '60m' }
          ]}
          disabled={timerActive}
          sx={{ color: '#667eea' }}
        />
      </Box>


      {/* Ambient Sound & Focus Mode Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={soundPlaying}
              onChange={(e) => dispatch(setSoundPlaying(e.target.checked))}
              color="primary"
            />
          }
          label={
            <Box display="flex" alignItems="center" gap={1}>
              {soundPlaying ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
              <Typography variant="body2" fontWeight={600}>Ambient Sound</Typography>
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={focusMode}
              onChange={(e) => dispatch(setFocusMode(e.target.checked))}
              color="secondary"
            />
          }
          label={<Typography variant="body2" fontWeight={600}>Focus Mode</Typography>}
        />
      </Box>

      {/* Focus Mode Overlay */}
      {focusMode && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 9998,
            pointerEvents: 'none',
          }}
        />
      )}
    </Paper>
  );
}
