import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Divider, Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { loginSuccess } from '../store/slices/userSlice';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import FaceIcon from '@mui/icons-material/Face';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dummy demo login action (customize for real login/magic-link backend)
  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMessage('✓ Magic link sent! Check your email.');
      setLoading(false);
    }, 1500);
  };

  // Demo login for navigation in demo scenarios
  const handleDemoLogin = () => {
    const mockUser = {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@neuroflow.com',
      ageGroup: 'adult',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=fff',
    };
    dispatch(loginSuccess({ user: mockUser, token: 'demo-token' }));
    navigate('/dashboard/adult');
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
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                🧠 Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to NeuroFlow Suite
              </Typography>
            </Box>

            {message && (
              <Alert severity={message.includes('✓') ? 'success' : 'info'} sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            {/* Face Recognition login */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              component={Link}
              to="/face-login"
              startIcon={<FaceIcon />}
              sx={{
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Login with Face Recognition
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or continue with email
              </Typography>
            </Divider>

            <form onSubmit={handleMagicLinkLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                  mb: 2
                }}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{ py: 1.5 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                sx={{ py: 1.5 }}
              >
                Facebook
              </Button>
            </Box>

            <Button
              fullWidth
              variant="text"
              onClick={handleDemoLogin}
              sx={{ mb: 2 }}
            >
              Try Demo Account
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#667eea', fontWeight: 700 }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
