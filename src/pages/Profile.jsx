import React, { useState } from 'react';
import {
  Container, Box, Typography, Paper, Avatar, TextField, Button, Grid,
  Switch, FormControlLabel, Divider, Alert, MenuItem
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/userSlice';
import Sidebar from '../components/layout/Sidebar';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';

// Animated avatar options using DiceBear API
const avatarOptions = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
];

export default function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
    pronouns: user?.pronouns || '',
    ageGroup: user?.ageGroup || 'adult',
    avatar: user?.avatar || avatarOptions[0],
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          avatar: formData.avatar,
          pronouns: formData.pronouns,
          ageGroup: formData.ageGroup
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update Redux store with new user data including avatar
        dispatch(updateUser({
          name: data.user.username,
          username: data.user.username,
          email: data.user.email,
          avatar: data.user.avatar,
          pronouns: data.user.pronouns,
          ageGroup: data.user.ageGroup
        }));
        setSaved(true);
        setError('');
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Update failed');
      }
    } catch (err) {
      setError('Network error. Please try again');
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            <PersonIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
            Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and preferences
          </Typography>
        </Box>

        {saved && <Alert severity="success" sx={{ mb: 3 }}>Profile updated successfully!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 4 }}>
          {/* Avatar Section */}
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar 
              src={formData.avatar} 
              sx={{ 
                width: 100, 
                height: 100, 
                mr: 3,
                border: '3px solid #667eea'
              }}
            >
              {formData.avatar ? null : formData.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{formData.name}</Typography>
              <Typography variant="body2" color="text.secondary">{formData.email}</Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {avatarOptions.map((url) => (
                  <Avatar
                    key={url}
                    src={url}
                    sx={{
                      border: formData.avatar === url ? '3px solid #667eea' : '2px solid #e0e0e0',
                      cursor: 'pointer',
                      width: 56,
                      height: 56,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      }
                    }}
                    onClick={() => setFormData({ ...formData, avatar: url })}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Personal Information */}
          <Typography variant="h6" fontWeight={700} mb={2}>Personal Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Pronouns"
                value={formData.pronouns}
                onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                placeholder="e.g., they/them, he/him, she/her"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Age Group"
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              >
                <MenuItem value="child">Child (6-12)</MenuItem>
                <MenuItem value="teen">Teen (13-18)</MenuItem>
                <MenuItem value="adult">Adult (19-60)</MenuItem>
                <MenuItem value="senior">Senior (60+)</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Preferences */}
          <Typography variant="h6" fontWeight={700} mb={2}>Preferences</Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
            <FormControlLabel control={<Switch defaultChecked />} label="Browser notifications" />
            <FormControlLabel control={<Switch />} label="Dark mode" />
            <FormControlLabel control={<Switch defaultChecked />} label="Sound effects" />
          </Box>

          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Paper>

        {/* Data Export */}
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Privacy & Data
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Download your data or delete your account
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined">Export Data</Button>
            <Button variant="outlined" color="error">Delete Account</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
