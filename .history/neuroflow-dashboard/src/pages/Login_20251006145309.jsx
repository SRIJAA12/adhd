import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Box, TextField, Button, Typography, Paper, Alert, CircularProgress,
  Divider, Container, Fade 
} from '@mui/material';
import { motion } from 'framer-motion';
import { loginSuccess } from '../store/slices/userSlice';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMagicLink = async () => {
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    // Simulate magic link sending
    setTimeout(() => {
      setSuccess(true);
      setMessage('✅ Magic link sent! Check your email for instant sign-in.');
      setLoading(false);
      
      // Auto-login for demo (remove in production)
      setTimeout(() => {
        const mockUser = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email: email,
          ageGroup: 'adult',
          avatar: `https://ui-avatars.com/api/?name=${email}&background=667eea&color=fff`,
        };
        dispatch(loginSuccess({ user: mockUser, token: 'demo-token-' + Date.now() }));
        localStorage.setItem('token', 'demo-token-' + Date.now());
        navigate('/dashboard/adult');
      }, 2000);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setMessage(`Redirecting to ${provider}...`);
    setTimeout(() => navigate('/signup'), 1000);
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
          <Paper elevation={24} sx={{ p: 5, borderRadius: 4 }}>
            {/* Logo & Title */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                🧠 NeuroFlow Suite
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={500}>
                Empowering ADHD Minds to Thrive
              </Typography>
            </Box>

            {message && (
              <Fade in={!!message}>
                <Alert severity={success ? 'success' : 'info'} sx={{ mb: 3 }}>
                  {message}
                </Alert>
              </Fade>
            )}

            {/* Email Magic Link */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMagicLink()}
              placeholder="you@example.com"
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleMagicLink}
              disabled={loading}
              sx={{
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #63408d 100%)',
                  boxShadow: '0 6px 25px rgba(102,126,234,0.5)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Magic Link'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                OR CONTINUE WITH
              </Typography>
            </Divider>

            {/* Social Logins */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<MicrosoftIcon />}
                onClick={() => handleSocialLogin('Microsoft')}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                Microsoft
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<AppleIcon />}
                onClick={() => handleSocialLogin('Apple')}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                Apple
              </Button>
            </Box>

            {/* Footer */}
            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="text.secondary" mb={1}>
                🔒 No passwords needed! We use secure magic links.
              </Typography>
              <Typography variant="body2">
                New here? <Link to="/signup" style={{ color: '#667eea', fontWeight: 700 }}>Create your profile</Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
