import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, Typography, TextField, Button, List, ListItem, Checkbox, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { addRoutine, toggleRoutineCompletion, deleteRoutine } from '../../store/slices/routineSlice';

export default function RoutinePlanner() {
  const routines = useSelector((state) => state.routine.routines);
  const dispatch = useDispatch();
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');

  const handleAdd = () => {
    if (!task.trim() || !time.trim()) return;
    dispatch(addRoutine({ task, time, completed: false }));
    setTask('');
    setTime('');
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        📅 Routine Planner
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Routine task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="Time (e.g. 9:00 AM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          size="small"
          sx={{ width: 120 }}
          placeholder="08:00 AM"
        />
        <Button variant="contained" onClick={handleAdd} disabled={!task || !time}>
          Add
        </Button>
      </Box>

      <List dense>
        {routines.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Add your daily routines here!
          </Typography>
        )}
        {routines.map(({ task, time, completed }, i) => (
          <ListItem
            key={i}
            secondaryAction={
              <IconButton edge="end" onClick={() => dispatch(deleteRoutine(i))} color="error" size="small">
                <Delete />
              </IconButton>
            }
          >
            <Checkbox checked={completed} onChange={() => dispatch(toggleRoutineCompletion(i))} />
            <Typography variant="body1" sx={{ textDecoration: completed ? 'line-through' : 'none' }}>
              {task} ({time})
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
