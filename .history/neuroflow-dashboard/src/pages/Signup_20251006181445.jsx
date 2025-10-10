import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, MenuItem, Divider, Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import FaceIcon from '@mui/icons-material/Face';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ageGroup: 'adult',
    gender: '',
    pronouns: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('✓ Account created! Check your email to verify.');
    setTimeout(() => navigate('/login'), 2000);
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
                🧠 Join NeuroFlow
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create your account - No password needed!
              </Typography>
            </Box>

            {message && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            {/* NEW: Face Recognition Signup Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              component={Link}
              to="/face-signup"
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
              Sign Up with Face Recognition
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or sign up with email
              </Typography>
            </Divider>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                select
                label="Age Group"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="child">Child (6-12)</MenuItem>
                <MenuItem value="teen">Teen (13-18)</MenuItem>
                <MenuItem value="adult">Adult (19-60)</MenuItem>
                <MenuItem value="senior">Senior (60+)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Preferred Pronouns (Optional)"
                name="pronouns"
                value={formData.pronouns}
                onChange={handleChange}
                placeholder="e.g., they/them, he/him, she/her"
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Create Account
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

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#667eea', fontWeight: 700 }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
