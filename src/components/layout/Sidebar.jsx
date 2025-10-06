import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MemoryIcon from '@mui/icons-material/Memory';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

const navItems = [
  { text: 'Tasks', icon: <AssignmentIcon />, route: '/tasks' },
  { text: 'Timer', icon: <AccessTimeIcon />, route: '/timer' },
  { text: 'Rewards', icon: <EmojiEventsIcon />, route: '/rewards' },
  { text: 'Memory', icon: <MemoryIcon />, route: '/memory' },
  { text: 'Progress', icon: <StarIcon />, route: '/achievements' },
  { text: 'Clipboard', icon: <ContentPasteIcon />, route: '/clipboard' },
  { text: 'Guidance', icon: <LightbulbIcon />, route: '/guidance' },
  { text: 'Streak', icon: <LocalFireDepartmentIcon />, route: '/streak' }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{
      width: 240,
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      display: { xs: 'none', md: 'block' },
      boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
    }}>
      <List sx={{ pt: 3 }}>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.route)}
            sx={{
              py: 1.5,
              px: 3,
              mb: 0.5,
              mx: 1,
              borderRadius: 2,
              bgcolor: location.pathname === item.route ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: 'white',
                '& .MuiTypography-root': { fontWeight: 600 }
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
