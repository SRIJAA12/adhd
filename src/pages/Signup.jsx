import React, { useState } from 'react';
import {
  Box, Paper, Button, TextField, Typography, Stepper, Step, StepLabel,
  MenuItem, Avatar, Container, Grid, Chip
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/userSlice';
import { motion } from 'framer-motion';

const ageGroups = [
  { value: 'child', label: 'Child (6-12)', emoji: '🧒', color: '#a1c4fd' },
  { value: 'teen', label: 'Teen (13-18)', emoji: '🚀', color: '#fbc2eb' },
  { value: 'adult', label: 'Adult (19-60)', emoji: '💼', color: '#667eea' },
  { value: 'senior', label: 'Senior (60+)', emoji: '🌟', color: '#f8ffae' }
];

const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna',
];

const steps = ['Email', 'Name', 'Age Group', 'Personalize', 'Avatar'];

export default function Signup() {
  const [activeStep, setActiveStep] = useState(0);
  const [fields, setFields] = useState({
    email: '',
    name: '',
    ageGroup: '',
    pronouns: '',
    avatar: avatarOptions[0]
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 0 && !fields.email.includes('@')) {
      return alert('Enter a valid email');
    }
    if (activeStep === 1 && !fields.name.trim()) {
      return alert('Name required');
    }
    if (activeStep === 2 && !fields.ageGroup) {
      return alert('Choose age group');
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinish = () => {
    const userObj = {
      id: Date.now().toString(),
      name: fields.name,
      email: fields.email,
      ageGroup: fields.ageGroup,
      pronouns: fields.pronouns,
      avatar: fields.avatar,
    };
    dispatch(loginSuccess({ user: userObj, token: 'token-' + Date.now() }));
    localStorage.setItem('token', 'token-' + Date.now());
    navigate(`/dashboard/${fields.ageGroup}`);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ p: 5, borderRadius: 4 }} component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          
          <Typography variant="h4" textAlign="center" mb={3} fontWeight={700}>
            Create Your NeuroFlow Profile
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 280 }}>
            {activeStep === 0 && (
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={fields.email}
                onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                autoFocus
              />
            )}
            {activeStep === 1 && (
              <TextField
                label="Your Name"
                fullWidth
                value={fields.name}
                onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                placeholder="Enter your name"
                autoFocus
              />
            )}
            {activeStep === 2 && (
              <Grid container spacing={2}>
                {ageGroups.map((opt) => (
                  <Grid item xs={12} sm={6} key={opt.value}>
                    <Paper
                      elevation={fields.ageGroup === opt.value ? 8 : 2}
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        border: fields.ageGroup === opt.value ? '3px solid #667eea' : '1px solid #ddd',
                        transition: 'all 0.3s',
                        '&:hover': { boxShadow: 6 }
                      }}
                      onClick={() => setFields((f) => ({ ...f, ageGroup: opt.value }))}
                    >
                      <Typography variant="h3" textAlign="center">{opt.emoji}</Typography>
                      <Typography variant="h6" textAlign="center" mt={1}>{opt.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            {activeStep === 3 && (
              <Box>
                <TextField
                  label="Preferred Pronouns (Optional)"
                  fullWidth
                  value={fields.pronouns}
                  onChange={(e) => setFields((f) => ({ ...f, pronouns: e.target.value }))}
                  placeholder="e.g., they/them, he/him, she/her"
                />
                <Typography variant="caption" color="text.secondary" mt={2} display="block">
                  We respect your identity and use your pronouns throughout the app.
                </Typography>
              </Box>
            )}
            {activeStep === 4 && (
              <Box>
                <Typography variant="h6" mb={2}>Choose Your Avatar</Typography>
                <Grid container spacing={2}>
                  {avatarOptions.map((url) => (
                    <Grid item xs={4} sm={2} key={url}>
                      <Avatar
                        src={url}
                        sx={{
                          width: 80,
                          height: 80,
                          cursor: 'pointer',
                          border: fields.avatar === url ? '4px solid #667eea' : '2px solid #ddd',
                          transition: 'all 0.3s',
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                        onClick={() => setFields((f) => ({ ...f, avatar: url }))}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleFinish} sx={{ px: 4 }}>
                Complete Setup
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
