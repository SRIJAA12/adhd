import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  InputAdornment
} from '@mui/material';
import { Edit, Delete, Save, Add } from '@mui/icons-material';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [taskInput, setTaskInput] = useState('');

  // Add a new task
  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { text: taskInput, completed: false }]);
    setTaskInput('');
  };

  // Toggle complete/incomplete
  const toggleComplete = (idx) => {
    setTasks(tasks.map((t, i) =>
      i === idx ? { ...t, completed: !t.completed } : t
    ));
  };

  // Edit
  const startEdit = (idx) => {
    setEditIndex(idx);
    setTaskInput(tasks[idx].text);
  };

  // Save edit
  const saveEdit = () => {
    setTasks(tasks.map((t, i) =>
      i === editIndex ? { ...t, text: taskInput } : t
    ));
    setEditIndex(null);
    setTaskInput('');
  };

  // Delete
  const deleteTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        🗂️ Tasks
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          placeholder="What do you need to do?"
          fullWidth
          size="small"
          onKeyPress={e => {
            if (e.key === 'Enter') {
              editIndex === null ? addTask() : saveEdit();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {editIndex === null ? (
                  <IconButton onClick={addTask} color="primary">
                    <Add />
                  </IconButton>
                ) : (
                  <IconButton onClick={saveEdit} color="success">
                    <Save />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <List dense>
        {tasks.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Add your first task!
          </Typography>
        )}
        {tasks.map((task, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => startEdit(idx)}
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTask(idx)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <Checkbox
              checked={task.completed}
              onChange={() => toggleComplete(idx)}
              sx={{ mr: 1 }}
            />
            <ListItemText
              primary={task.text}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'grey.600' : undefined,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
