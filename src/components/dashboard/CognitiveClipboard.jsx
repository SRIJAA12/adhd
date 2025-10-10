import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { Add, Delete, ContentCopy } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addClipboardItem, removeClipboardItem } from '../../store/slices/memorySlice';
import { motion, AnimatePresence } from 'framer-motion';

const CognitiveClipboard = () => {
  const [newNote, setNewNote] = useState('');
  const clipboardItems = useSelector((state) => state.memory.clipboardItems);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (newNote.trim()) {
      dispatch(addClipboardItem({ text: newNote }));
      setNewNote('');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        📋 Quick Notes
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Jot down quick thoughts before they slip away
      </Typography>

      {/* Add Note Input */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type something you want to remember..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          multiline
          maxRows={2}
        />
        <IconButton
          color="primary"
          onClick={handleAdd}
          disabled={!newNote.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'grey.300' },
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Notes List */}
      <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
        <AnimatePresence>
          {clipboardItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No notes yet. Add your first one! ✨
              </Typography>
            </Box>
          ) : (
            clipboardItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ListItem
                  sx={{
                    mb: 1,
                    bgcolor: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' },
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    secondary={new Date(item.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    primaryTypographyProps={{ style: { wordBreak: 'break-word' } }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleCopy(item.text)}
                      sx={{ mr: 1 }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => dispatch(removeClipboardItem(item.id))}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </List>

      {/* Counter */}
      {clipboardItems.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip
            label={`${clipboardItems.length} note${clipboardItems.length > 1 ? 's' : ''} saved`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
    </Paper>
  );
};

export default CognitiveClipboard;
