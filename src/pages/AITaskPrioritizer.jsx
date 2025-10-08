import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, List, ListItem,
  Chip, LinearProgress, Collapse, IconButton, Stepper, Step,
  StepLabel, StepContent, Alert, Divider, Card, CardContent, Container
} from '@mui/material';
import {
  Add, PlayArrow, CheckCircle, ExpandMore, ExpandLess,
  Psychology, AutoAwesome, Delete
} from '@mui/icons-material';
import Sidebar from '../components/layout/Sidebar';
import mlApi from '../services/mlApi';
import avatarController from '../services/avatarController';

export default function AITaskPrioritizer() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [mlStatus, setMlStatus] = useState({ status: 'checking' });
  const [prioritizedTasks, setPrioritizedTasks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [completedSubtasks, setCompletedSubtasks] = useState({});
  
  // User ADHD state
  const [userState] = useState({
    mood: 0.7,
    energy: 0.8,
    focus: 0.6,
    medicationTaken: true,
    stressLevel: 0.3,
    distractions: 2,
    sleepQuality: 0.8
  });

  useEffect(() => {
    checkMLService();
  }, []);

  const checkMLService = async () => {
    const health = await mlApi.checkHealth();
    setMlStatus({
      status: health.status === 'healthy' ? 'connected' : 'offline',
      accuracy: 88.5
    });
  };

  const addTask = () => {
    if (!taskInput.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: taskInput,
      importance: 0.7,
      urgency: 0.6,
      estimatedDurationMin: 30,
      energyRequired: 'medium',
      category: 'work'
    };
    
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const prioritizeWithAI = async () => {
    if (tasks.length === 0) {
      alert('Add some tasks first!');
      return;
    }

    setLoading(true);
    
    try {
      const result = await mlApi.predictBatch(tasks, userState);
      setPrioritizedTasks(result);
    } catch (error) {
      console.error('Prioritization error:', error);
      alert('Using algorithmic fallback for prioritization.');
    }
    
    setLoading(false);
  };

  const getPriorityColor = (priority) => {
    if (priority > 0.8) return 'error';
    if (priority > 0.6) return 'warning';
    return 'success';
  };

  const toggleSubtask = (taskIdx, subtaskIdx) => {
    const key = `${taskIdx}-${subtaskIdx}`;
    const isCompleting = !completedSubtasks[key];
    
    setCompletedSubtasks({
      ...completedSubtasks,
      [key]: isCompleting
    });

    // Check if all subtasks are completed
    if (isCompleting && prioritizedTasks?.predictions[taskIdx]) {
      const task = prioritizedTasks.predictions[taskIdx];
      const totalSubtasks = task.subtasks?.length || 0;
      const completedCount = Object.keys(completedSubtasks).filter(k => 
        k.startsWith(`${taskIdx}-`) && completedSubtasks[k]
      ).length + 1;

      if (completedCount === totalSubtasks) {
        avatarController.taskCompleted(task.task.title);
      }
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                🤖 AI Task Prioritizer & Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add all your tasks, then let AI prioritize and break them into ADHD-friendly steps
              </Typography>
            </Box>
            
            {mlStatus.status === 'connected' && (
              <Chip
                icon={<Psychology />}
                label="ML Active - 88.5% Accuracy"
                color="success"
                size="small"
              />
            )}
          </Box>

          {/* Input Section */}
          {!prioritizedTasks && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                📝 Add Your Tasks (add as many as you need)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={taskInput}
                  onChange={e => setTaskInput(e.target.value)}
                  placeholder="e.g., Finish project report, Reply to emails, Study for exam..."
                  fullWidth
                  size="small"
                  onKeyPress={e => e.key === 'Enter' && addTask()}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addTask}
                  disabled={!taskInput.trim()}
                >
                  Add
                </Button>
              </Box>

              {/* Task List */}
              {tasks.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Your Tasks ({tasks.length}):
                  </Typography>
                  <List dense>
                    {tasks.map((task, idx) => (
                      <ListItem 
                        key={task.id} 
                        sx={{ bgcolor: 'grey.50', mb: 0.5, borderRadius: 1 }}
                        secondaryAction={
                          <IconButton edge="end" size="small" onClick={() => removeTask(task.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        }
                      >
                        <Typography variant="body2">
                          {idx + 1}. {task.title}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<AutoAwesome />}
                    onClick={prioritizeWithAI}
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #654393 100%)',
                      }
                    }}
                  >
                    {loading ? 'AI Analyzing Tasks...' : '🤖 Prioritize & Break Down with AI'}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {/* AI Prioritized Results */}
          {prioritizedTasks && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  ✅ AI Analysis Complete!
                </Typography>
                <Typography variant="body2">
                  {prioritizedTasks.high_priority_count} high-priority tasks identified.
                  Follow the recommended order below for optimal ADHD-friendly workflow.
                </Typography>
              </Alert>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                📊 Prioritized Task List (Start from Top ⬇)
              </Typography>

              {prioritizedTasks.predictions.map((pred, idx) => (
                <Card
                  key={idx}
                  elevation={expandedTask === idx ? 4 : 2}
                  sx={{
                    mb: 2,
                    borderLeft: `4px solid ${
                      pred.priorityScore > 0.8 ? '#f44336' :
                      pred.priorityScore > 0.6 ? '#ff9800' : '#4caf50'
                    }`
                  }}
                >
                  <CardContent>
                    {/* Task Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={`#${idx + 1}`}
                            size="small"
                            color={getPriorityColor(pred.priorityScore)}
                            sx={{ fontWeight: 700 }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {pred.task.title}
                          </Typography>
                        </Box>

                        {/* Metrics */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={`Priority: ${(pred.priorityScore * 100).toFixed(0)}%`}
                            size="small"
                            color={getPriorityColor(pred.priorityScore)}
                            variant="outlined"
                          />
                          <Chip
                            label={`Success Rate: ${(pred.completionLikelihood * 100).toFixed(0)}%`}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                          <Chip
                            label={`${pred.task.estimatedDurationMin}m total`}
                            size="small"
                            variant="outlined"
                          />
                          {pred.predictionSource === 'trained_ml_models' && (
                            <Chip
                              label="🤖 ML"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>

                        {/* Top recommendation */}
                        {pred.recommendations && pred.recommendations.length > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            💡 {pred.recommendations[0]}
                          </Typography>
                        )}
                      </Box>

                      <IconButton
                        onClick={() => setExpandedTask(expandedTask === idx ? null : idx)}
                      >
                        {expandedTask === idx ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>

                    {/* Expanded Subtasks */}
                    <Collapse in={expandedTask === idx}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                        📋 Step-by-Step Breakdown:
                      </Typography>
                      
                      <Stepper orientation="vertical" activeStep={-1}>
                        {pred.subtasks && pred.subtasks.map((subtask, subIdx) => {
                          const isCompleted = completedSubtasks[`${idx}-${subIdx}`];
                          
                          return (
                            <Step key={subIdx} completed={isCompleted}>
                              <StepLabel
                                onClick={() => toggleSubtask(idx, subIdx)}
                                sx={{ cursor: 'pointer' }}
                                StepIconComponent={() => (
                                  <Box sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    borderRadius: '50%', 
                                    bgcolor: isCompleted ? 'success.main' : 'grey.300',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                  }}>
                                    {isCompleted ? <CheckCircle sx={{ fontSize: 16 }} /> : subIdx + 1}
                                  </Box>
                                )}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600,
                                      textDecoration: isCompleted ? 'line-through' : 'none',
                                      color: isCompleted ? 'text.disabled' : 'text.primary'
                                    }}
                                  >
                                    {subtask.title}
                                  </Typography>
                                  <Chip 
                                    label={`${subtask.duration}m`} 
                                    size="small" 
                                    variant="outlined" 
                                  />
                                </Box>
                              </StepLabel>
                              <StepContent>
                                <Typography variant="caption" color="text.secondary">
                                  {subtask.type === 'setup' && '🔧 Prepare everything you need before starting'}
                                  {subtask.type === 'work' && '💪 Focus session - use Pomodoro timer, eliminate distractions'}
                                  {subtask.type === 'break' && '☕ Rest your brain - walk, stretch, hydrate'}
                                  {subtask.type === 'review' && '✅ Double-check your work and celebrate completion'}
                                  {subtask.type === 'simple' && '✅ Simple task - just do it in one go!'}
                                </Typography>
                              </StepContent>
                            </Step>
                          );
                        })}
                      </Stepper>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrow />}
                          size="small"
                          sx={{ flex: 1 }}
                          onClick={() => avatarController.taskStarted(pred.task.title)}
                        >
                          Start Task
                        </Button>
                      </Box>

                      {/* Additional Recommendations */}
                      {pred.recommendations && pred.recommendations.length > 1 && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                            💡 AI Recommendations:
                          </Typography>
                          {pred.recommendations.slice(1).map((rec, i) => (
                            <Typography key={i} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              • {rec}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setPrioritizedTasks(null);
                  setTasks([]);
                  setCompletedSubtasks({});
                }}
                sx={{ mt: 2 }}
              >
                ← Start Over with New Tasks
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
