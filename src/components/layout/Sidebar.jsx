import React from 'react';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MemoryIcon from '@mui/icons-material/Memory';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { text: 'Tasks', icon: <AssignmentIcon />, route: '/tasks' },
  { text: 'Timer', icon: <AccessTimeIcon />, route: '/timer' },
  { text: 'Rewards', icon: <EmojiEventsIcon />, route: '/rewards' },
  { text: 'Memory', icon: <MemoryIcon />, route: '/memory' },
  { text: 'Achievements', icon: <StarIcon />, route: '/achievements' },
  { text: 'Guidance', icon: <LightbulbIcon />, route: '/guidance' }
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <Box sx={{
      width: 80, minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', py: 3
    }}>
      <IconButton onClick={() => navigate('/')} sx={{ color: 'white', mb: 2 }}><HomeIcon /></IconButton>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.route)}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: 'white', display: { md: 'none' } }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
