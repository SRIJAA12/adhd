import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Checkbox,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addPoints as addPointsToUser } from '../../store/slices/userSlice';
import { unlockBadge } from '../../store/slices/gamificationSlice';
import { addPointsToBackend } from '../../utils/pointsSync';

const TaskGuidance = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const steps = [
    {
      label: 'Start with a simple task',
      description: 'Pick the easiest task from your list to build momentum.',
    },
    {
      label: 'Set a timer for 10 minutes',
      description: 'Use the Pomodoro technique to maintain focus.',
    },
    {
      label: 'Eliminate distractions',
      description: 'Close unnecessary tabs and put your phone on silent.',
    },
    {
      label: 'Complete the task',
      description: 'Focus on finishing, not perfection.',
    },
  ];

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Task completed! Add points to user
      const pointsToAdd = 10;
      dispatch(addPointsToUser(pointsToAdd));
      
      // Sync with backend
      if (user?.id) {
        await addPointsToBackend(user.id, pointsToAdd);
      }
      
      dispatch(unlockBadge(1)); // First Task badge
      setActiveStep(0);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        📝 Task Guidance
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Break down your work into manageable steps
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {step.description}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  {index === steps.length - 1 ? 'Complete' : 'Continue'}
                </Button>
                <Button disabled={index === 0} onClick={handleBack} size="small">
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
          <Typography>All steps completed - you're doing great! 🎉</Typography>
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1 }}>
            Start Another Task
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default TaskGuidance;
