import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, List, ListItem, Checkbox, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function RoutinePlanner() {
  const [routines, setRoutines] = useState([]);
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');

  const addRoutine = () => {
    if (!task.trim() || !time.trim()) return;
    setRoutines([...routines, { task, time, completed: false }]);
    setTask('');
    setTime('');
  };

  const toggleComplete = (index) => {
    setRoutines(routines.map((r, i) => i === index ? {...r, completed: !r.completed} : r));
  };

  const deleteRoutine = (index) => {
    setRoutines(routines.filter((_, i) => i !== index));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📅 Routine Planner</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Routine task"
          value={task}
          onChange={e => setTask(e.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="Time (e.g. 9:00 AM)"
          value={time}
          onChange={e => setTime(e.target.value)}
          size="small"
          sx={{ width: 120 }}
          placeholder="08:00 AM"
        />
        <Button variant="contained" onClick={addRoutine} disabled={!task || !time}>Add</Button>
      </Box>

      <List dense>
        {routines.length === 0 && <Typography variant="body2" color="text.secondary">Add your daily routines here!</Typography>}
        {routines.map(({ task, time, completed }, i) => (
          <ListItem key={i} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => deleteRoutine(i)} color="error" size="small">
                <Delete />
              </IconButton>
            </>
          }>
            <Checkbox checked={completed} onChange={() => toggleComplete(i)} />
            <Typography variant="body1" sx={{ textDecoration: completed ? 'line-through' : 'none' }}>
              {task} ({time})
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
