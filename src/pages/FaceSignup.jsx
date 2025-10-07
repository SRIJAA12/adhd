import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, MenuItem, Alert, Button, Avatar
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FaceRecognition from '../components/auth/FaceRecognition';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = 'http://localhost:5000';

const avatarOptions = [
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
];

export default function FaceSignup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    adhdSubtype: 'combined',
    avatar: avatarOptions[0],  // Default avatar
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFaceCapture = async (descriptor) => {
    if (!formData.username || !formData.email) {
      setError('Please fill in all fields before capturing your face');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/signup/face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          descriptor,
          adhdSubtype: formData.adhdSubtype,
          avatar: formData.avatar,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/face-login');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check your connection.');
    }
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
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
            <Button
              component={Link}
              to="/signup"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2 }}
            >
              Back to Signup Options
            </Button>

            <Box textAlign="center" mb={4}>
              <Typography variant="h3" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                👤 Face Recognition Signup
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No passwords to remember! Just your face.
              </Typography>
            </Box>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                ✓ Registration successful! Redirecting to login...
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              select
              label="ADHD Type"
              value={formData.adhdSubtype}
              onChange={(e) => setFormData({ ...formData, adhdSubtype: e.target.value })}
              sx={{ mb: 3 }}
            >
              <MenuItem value="combined">Combined Type</MenuItem>
              <MenuItem value="inattentive">Primarily Inattentive</MenuItem>
              <MenuItem value="hyperactive">Primarily Hyperactive-Impulsive</MenuItem>
            </TextField>

            <Typography variant="body1" sx={{ mb: 1 }}>
              Choose your avatar:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {avatarOptions.map((url) => (
                <Avatar
                  key={url}
                  src={url}
                  sx={{
                    width: 56,
                    height: 56,
                    cursor: 'pointer',
                    border: formData.avatar === url ? '3px solid #667eea' : 'none',
                  }}
                  onClick={() => setFormData({ ...formData, avatar: url })}
                />
              ))}
            </Box>

            <FaceRecognition onCapture={handleFaceCapture} mode="signup" />

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                🔒 Your face data is encrypted and stored securely
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
