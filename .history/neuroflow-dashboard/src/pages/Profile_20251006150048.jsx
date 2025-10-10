import React, { useState } from 'react';
import {
  Container, Box, Typography, Paper, Avatar, TextField, Button, Grid,
  Switch, FormControlLabel, Divider, Alert
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/userSlice';
import Sidebar from '../components/layout/Sidebar';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';

export default function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    pronouns: user?.pronouns || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch(updateUser(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          {/* Avatar Section */}
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar src={user?.avatar} sx={{ width: 100, height: 100, mr: 3 }}>
              {user?.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                Change Avatar
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Personal Information */}
          <Typography variant="h6" fontWeight={700} mb={2}>
            Personal Information
          </Typography>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preferred Pronouns"
                value={formData.pronouns}
                onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                placeholder="e.g., they/them, he/him, she/her"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Preferences */}
          <Typography variant="h6" fontWeight={700} mb={2}>
            Preferences
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Browser notifications"
            />
            <FormControlLabel
              control={<Switch />}
              label="Dark mode"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Sound effects"
            />
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
