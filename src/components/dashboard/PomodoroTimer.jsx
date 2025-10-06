import React, { useState, useRef } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const DEFAULT_FOCUS = 25;
const DEFAULT_BREAK = 5;

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(DEFAULT_FOCUS);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef();

  const startTimer = () => {
    if (timerRef.current) return; // Prevent double interval
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          if (minutes === 0) {
            // Switch between focus and break
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsBreak((prev) => !prev);
            setMinutes(isBreak ? DEFAULT_FOCUS : DEFAULT_BREAK);
            setSeconds(0);
            setIsActive(false);
          } else {
            setMinutes((m) => m - 1);
            return 59;
          }
        }
        return s - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsBreak(false);
    setIsActive(false);
    setMinutes(DEFAULT_FOCUS);
    setSeconds(0);
  };

  React.useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {isBreak ? "Break Time 🧘" : "Focus Time 🚀"}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {!isActive ? (
            <Button variant="contained" color={isBreak ? 'warning' : 'success'} onClick={startTimer}>
              Start
            </Button>
          ) : (
            <Button variant="outlined" color="error" onClick={pauseTimer}>
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} size="small">
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
