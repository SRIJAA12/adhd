import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, Alert, Button
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import FaceRecognition from '../components/auth/FaceRecognition';
import { loginSuccess } from '../store/slices/userSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = 'http://localhost:5000';

export default function FaceLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFaceCapture = async (descriptor) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/login/face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Dispatch to Redux
        dispatch(loginSuccess({
          user: {
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            ageGroup: 'adult', // Default, can be customized
            avatar: `https://ui-avatars.com/api/?name=${data.user.username}&background=667eea&color=fff`,
          },
          token: data.token
        }));

        navigate('/dashboard/adult');
      } else {
        setError(data.error || 'Face not recognized');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
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
              to="/login"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2 }}
            >
              Back to Login Options
            </Button>

            <Box textAlign="center" mb={4}>
              <Typography variant="h3" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                👤 Face Recognition Login
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Simply show your face to log in
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <FaceRecognition onCapture={handleFaceCapture} mode="login" />

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary" mb={2}>
                New to face login? <Link to="/face-signup" style={{ color: '#667eea', fontWeight: 700 }}>Sign up with face</Link>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                🔒 Secure face recognition powered by AI
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
