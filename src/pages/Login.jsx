import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, Divider, Paper, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { loginSuccess } from '../store/slices/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSignup, setShowSignup] = useState(false); // For signup call
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Simulate user registry for demo (in real life: query backend)
  // For now, ALL emails are treated as new = need to sign up.
  const registeredEmails = ['demo@demo.com']; // Only allow demo@demo.com as direct login for demo

  const handleMagicLinkLogin = async () => {
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setMessage('');
    setTimeout(() => {
      // If email not registered, redirect to signup
      if (!registeredEmails.includes(email)) {
        setLoading(false);
        setShowSignup(true); // Show option to navigate to signup
      } else {
        // Mock login for registered user
        const mockUser = {
          id: '123',
          name: email.split('@')[0],
          email: email,
        };
        const mockToken = 'demo-token-' + Date.now();
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        localStorage.setItem('token', mockToken);
        setLoading(false);
        navigate('/dashboard');
      }
    }, 1200);
  };

  // Social logins should go to signup to capture user info
  const handleSocialLogin = (provider) => {
    setShowSignup(true); // For demo, social login triggers signup flow
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 450,
            width: '100%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              NeuroFlow
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ADHD-Focused Productivity Platform
            </Typography>
          </Box>

          {message && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleMagicLinkLogin()}
            sx={{ mb: 2 }}
            autoFocus
            placeholder="you@example.com"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleMagicLinkLogin}
            disabled={loading}
            sx={{
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #63408d 100%)' },
            }}
          >
            {loading ? 'Checking...' : 'CONTINUE WITH EMAIL'}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => handleSocialLogin('google')}
            sx={{ mb: 1.5, py: 1.5 }}
          >
            🔍 CONTINUE WITH GOOGLE
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => handleSocialLogin('microsoft')}
            sx={{ mb: 1.5, py: 1.5 }}
          >
            🪟 CONTINUE WITH MICROSOFT
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => handleSocialLogin('apple')}
            sx={{ py: 1.5 }}
          >
            🍎 CONTINUE WITH APPLE
          </Button>

          {/* Signup Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              ✨ No password needed! Secure login via email.
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
              Easily sign up if you’re new!
            </Typography>
            <Typography variant="caption" sx={{ mt: 2 }}>
              Don’t have an account?
              <Link to="/signup" style={{ color: "#667eea", fontWeight: 600, marginLeft: 4 }}>
                Sign up here!
              </Link>
            </Typography>
            {/* Show prompt to signup if email not registered */}
            {showSignup && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  It looks like you’re new. <Link to="/signup" style={{ color: '#764ba2', fontWeight: 700 }}>Sign up here!</Link>
                </Alert>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
