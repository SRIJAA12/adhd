import React from 'react';
import { 
  AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userSlice';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        backdropFilter: 'blur(8px)'
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h5" 
            component={Link}
            to="/"
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              mr: 4
            }}
          >
            🧠 NeuroFlow
          </Typography>
          
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button 
                component={Link} 
                to="/" 
                startIcon={<HomeIcon />}
                sx={{ color: 'text.primary', fontWeight: 600 }}
              >
                Home
              </Button>
              <Button 
                component={Link} 
                to={`/dashboard/${user?.ageGroup || 'adult'}`}
                startIcon={<DashboardIcon />}
                sx={{ color: 'text.primary', fontWeight: 600 }}
              >
                Dashboard
              </Button>
            </Box>
          )}
        </Box>

        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleMenu}>
              <Avatar src={user?.avatar} sx={{ width: 40, height: 40 }}>
                {user?.name?.[0]}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button 
            component={Link} 
            to="/login" 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700
            }}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
