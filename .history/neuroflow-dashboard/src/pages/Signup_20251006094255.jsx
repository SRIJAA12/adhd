import React, { useState } from 'react';
import { Box, Paper, Button, TextField, Typography, Stepper, Step, StepLabel, MenuItem, Avatar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, updateSignUpField } from '../store/slices/userSlice';
import { motion } from 'framer-motion';

const ageGroups = [
  { value: 'child', label: 'Child (6-12)' },
  { value: 'teen', label: 'Teen (13-18)' },
  { value: 'adult', label: 'Adult (19-60)' },
  { value: 'senior', label: 'Senior (60+)' }
];
const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' }
];
const pronouns = [
  { value: 'he/him', label: 'He/Him' },
  { value: 'she/her', label: 'She/Her' },
  { value: 'they/them', label: 'They/Them' },
  { value: 'custom', label: 'Custom...' }
];

const avatars = [
  { url: 'https://avatars.dicebear.com/api/bottts/1.svg', label: 'Bot 1' },
  { url: 'https://avatars.dicebear.com/api/bottts/2.svg', label: 'Bot 2' },
  { url: 'https://avatars.dicebear.com/api/bottts/3.svg', label: 'Bot 3' }
];

const steps = [
  'Email Address',
  'Name',
  'Age Group',
  'Gender/Pronouns',
  'Choose an Avatar'
];

export default function Signup() {
  const [activeStep, setActiveStep] = useState(0);
  const [fields, setFields] = useState({
    email: '',
    name: '',
    ageGroup: '',
    gender: '',
    pronouns: '',
    customPronoun: '',
    avatar: avatars[0].url
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    // Minimal validation for each step
    switch (activeStep) {
      case 0:
        if (!fields.email.includes('@')) return alert('Enter a valid email!');
        break;
      case 1:
        if (!fields.name.trim()) return alert('Name required!');
        break;
      case 2:
        if (!fields.ageGroup) return alert('Choose your age group');
        break;
      case 3:
        if (!fields.gender) return alert('Select a gender or skip');
        break;
      default:
        break;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Final submission
  const handleFinish = () => {
    // Merge custom pronouns if chosen
    let finalPronouns = fields.pronouns === 'custom' ? fields.customPronoun : fields.pronouns;
    const userObj = {
      name: fields.name,
      email: fields.email,
      ageGroup: fields.ageGroup,
      gender: fields.gender,
      pronouns: finalPronouns,
      avatar: fields.avatar,
      id: Date.now().toString()
    };
    dispatch(updateSignUpField(userObj));
    dispatch(loginSuccess({ user: userObj, token: 'demo-token-' + Date.now() }));
    localStorage.setItem('token', 'demo-token-' + Date.now());
    navigate(`/dashboard/${userObj.ageGroup || 'adult'}`); // after successful login/signup

  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          minWidth: 350,
          maxWidth: 420,
          borderRadius: 4
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {activeStep === 0 && (
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={fields.email}
              onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
              autoFocus
              sx={{ mb: 2 }}
              placeholder="your@email.com"
            />
          )}
          {activeStep === 1 && (
            <TextField
              label="First name"
              fullWidth
              value={fields.name}
              onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
              autoFocus
              sx={{ mb: 2 }}
              placeholder="Type your name"
            />
          )}
          {activeStep === 2 && (
            <TextField
              select
              label="Age Group"
              fullWidth
              value={fields.ageGroup}
              onChange={e => setFields(f => ({ ...f, ageGroup: e.target.value }))}
              sx={{ mb: 2 }}
            >
              {ageGroups.map(opt => (
                <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          )}
          {activeStep === 3 && (
            <>
              <TextField
                select
                label="Gender"
                fullWidth
                value={fields.gender}
                onChange={e => setFields(f => ({ ...f, gender: e.target.value }))}
                sx={{ mb: 2 }}
              >
                {genders.map(opt => (
                  <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Pronouns"
                fullWidth
                value={fields.pronouns}
                onChange={e => setFields(f => ({ ...f, pronouns: e.target.value }))}
                sx={{ mb: 2 }}
              >
                {pronouns.map(opt => (
                  <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
              {fields.pronouns === 'custom' && (
                <TextField
                  label="Custom Pronouns"
                  fullWidth
                  value={fields.customPronoun}
                  onChange={e => setFields(f => ({ ...f, customPronoun: e.target.value }))}
                  sx={{ mb: 2 }}
                  autoFocus
                />
              )}
            </>
          )}
          {activeStep === 4 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Pick an avatar for your dashboard:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {avatars.map((a) => (
                  <Avatar
                    key={a.url}
                    src={a.url}
                    sx={{
                      width: 56,
                      height: 56,
                      border: fields.avatar === a.url ? '3px solid #667eea' : undefined,
                      cursor: 'pointer'
                    }}
                    onClick={() => setFields(f => ({ ...f, avatar: a.url }))}
                  />
                ))}
              </Box>
            </>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>Back</Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleFinish}>Finish</Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
