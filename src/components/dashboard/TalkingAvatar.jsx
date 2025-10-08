import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Collapse,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  VolumeUp,
  VolumeOff,
  Close,
  Settings,
  ExpandMore,
  ExpandLess,
  Refresh,
  Psychology,
  EmojiEmotions,
} from '@mui/icons-material';
import {
  setAvatarVisibility,
  updateAvatarSettings,
  updateNotificationSettings,
  clearConversationHistory,
} from '../../store/slices/avatarSlice';
import avatarController from '../../services/avatarController';

// 3D Avatar Model Component
function AvatarModel({ url, isSpeaking, mood }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  // Animate based on speaking state
  useFrame((state) => {
    if (!modelRef.current) return;

    // Gentle breathing animation
    const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    modelRef.current.position.y = breathe;

    // Speaking animation - slight head bob
    if (isSpeaking) {
      const bob = Math.sin(state.clock.elapsedTime * 8) * 0.03;
      modelRef.current.rotation.x = bob;
    } else {
      modelRef.current.rotation.x = 0;
    }

    // Mood-based subtle rotation
    if (mood === 'celebrating') {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={2.2}
      position={[0, -2, 0]}
    />
  );
}

// Loading fallback
function LoadingAvatar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Loading avatar...
      </Typography>
    </Box>
  );
}

export default function TalkingAvatar() {
  const dispatch = useDispatch();
  const {
    isVisible,
    isSpeaking,
    currentMessage,
    avatarMood,
    settings,
    notifications,
    conversationHistory,
  } = useSelector((state) => state.avatar);

  const [showSettings, setShowSettings] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const avatarUrl = 'https://models.readyplayer.me/68e634acd4242f6de747b5d6.glb';

  useEffect(() => {
    // Greet user when component mounts
    const timer = setTimeout(() => {
      avatarController.morningGreeting();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVoiceToggle = () => {
    dispatch(
      updateAvatarSettings({
        voiceEnabled: !settings.voiceEnabled,
      })
    );
    if (settings.voiceEnabled) {
      avatarController.stop();
    }
  };

  const handleClose = () => {
    avatarController.stop();
    setIsExpanded(false);
  };

  const handleHide = () => {
    avatarController.stop();
    dispatch(setAvatarVisibility(false));
  };

  const getMoodEmoji = () => {
    switch (avatarMood) {
      case 'happy':
        return '😊';
      case 'encouraging':
        return '💪';
      case 'concerned':
        return '🤗';
      case 'celebrating':
        return '🎉';
      default:
        return '😊';
    }
  };

  const getMoodColor = () => {
    switch (avatarMood) {
      case 'happy':
        return '#10b981';
      case 'encouraging':
        return '#3b82f6';
      case 'concerned':
        return '#f59e0b';
      case 'celebrating':
        return '#ec4899';
      default:
        return '#10b981';
    }
  };

  if (!isVisible) return null;

  // Minimized floating button
  if (!isExpanded) {
    return (
      <Paper
        elevation={8}
        onClick={() => setIsExpanded(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 70,
          height: 70,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          background: `linear-gradient(135deg, ${getMoodColor()} 0%, ${getMoodColor()}dd 100%)`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          },
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Typography variant="h4">{getMoodEmoji()}</Typography>
          {isSpeaking && (
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#4caf50',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                },
              }}
            />
          )}
        </Box>
      </Paper>
    );
  }

  // Expanded full view
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 380,
        maxHeight: '85vh',
        borderRadius: 3,
        overflow: 'auto',
        zIndex: 1000,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        animation: 'slideIn 0.3s ease',
        '@keyframes slideIn': {
          from: { transform: 'scale(0.5)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${getMoodColor()} 0%, ${getMoodColor()}dd 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight={700}>
            {getMoodEmoji()} Your AI Companion
          </Typography>
          {isSpeaking && (
            <Chip
              label="Speaking..."
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.3)',
                color: 'white',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            />
          )}
        </Box>
        <Box display="flex" gap={0.5}>
          <Tooltip title={settings.voiceEnabled ? 'Mute' : 'Unmute'}>
            <IconButton size="small" onClick={handleVoiceToggle} sx={{ color: 'white' }}>
              {settings.voiceEnabled ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={() => setShowSettings(!showSettings)}
              sx={{ color: 'white' }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="Minimize">
            <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
              <ExpandLess />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hide">
            <IconButton size="small" onClick={handleHide} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 3D Avatar Canvas */}
      <Box sx={{ height: 350, bgcolor: '#f0f4f8' }}>
        <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <Suspense fallback={<LoadingAvatar />}>
            <AvatarModel url={avatarUrl} isSpeaking={isSpeaking} mood={avatarMood} />
            <Environment preset="sunset" />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </Box>

      {/* Current Message Display */}
      {currentMessage && (
        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            💬 "{currentMessage}"
          </Typography>
        </Box>
      )}

      {/* Quick Actions */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => avatarController.encouragement()}
          startIcon={<EmojiEmotions />}
        >
          Encourage Me
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => avatarController.overwhelmed()}
          startIcon={<Psychology />}
        >
          I'm Overwhelmed
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => avatarController.explainFeatures()}
          startIcon={<Refresh />}
        >
          What Can You Do?
        </Button>
      </Box>

      <Divider />

      {/* Settings Panel */}
      <Collapse in={showSettings}>
        <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Voice Settings
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Speech Rate: {settings.voiceRate.toFixed(1)}x
            </Typography>
            <Slider
              value={settings.voiceRate}
              onChange={(e, value) =>
                dispatch(updateAvatarSettings({ voiceRate: value }))
              }
              min={0.5}
              max={2}
              step={0.1}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" gutterBottom>
              Volume: {Math.round(settings.volume * 100)}%
            </Typography>
            <Slider
              value={settings.volume}
              onChange={(e, value) =>
                dispatch(updateAvatarSettings({ volume: value }))
              }
              min={0}
              max={1}
              step={0.1}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Notification Settings
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={notifications.timerReminders}
                onChange={(e) =>
                  dispatch(
                    updateNotificationSettings({
                      timerReminders: e.target.checked,
                    })
                  )
                }
                size="small"
              />
            }
            label={<Typography variant="caption">Timer Reminders</Typography>}
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.taskReminders}
                onChange={(e) =>
                  dispatch(
                    updateNotificationSettings({
                      taskReminders: e.target.checked,
                    })
                  )
                }
                size="small"
              />
            }
            label={<Typography variant="caption">Task Reminders</Typography>}
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.encouragement}
                onChange={(e) =>
                  dispatch(
                    updateNotificationSettings({
                      encouragement: e.target.checked,
                    })
                  )
                }
                size="small"
              />
            }
            label={<Typography variant="caption">Encouragement Messages</Typography>}
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.breaks}
                onChange={(e) =>
                  dispatch(
                    updateNotificationSettings({
                      breaks: e.target.checked,
                    })
                  )
                }
                size="small"
              />
            }
            label={<Typography variant="caption">Break Reminders</Typography>}
          />
        </Box>
      </Collapse>

      {/* Conversation History */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ cursor: 'pointer' }}
          onClick={() => setShowHistory(!showHistory)}
        >
          <Typography variant="caption" fontWeight={600}>
            Conversation History ({conversationHistory.length})
          </Typography>
          <IconButton size="small">
            {showHistory ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={showHistory}>
          <List dense sx={{ maxHeight: 200, overflowY: 'auto', mt: 1 }}>
            {conversationHistory.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                No conversation yet
              </Typography>
            ) : (
              conversationHistory.slice(-10).reverse().map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={item.message}
                    secondary={new Date(item.timestamp).toLocaleTimeString()}
                    primaryTypographyProps={{ variant: 'caption' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))
            )}
          </List>
          {conversationHistory.length > 0 && (
            <Button
              size="small"
              fullWidth
              onClick={() => dispatch(clearConversationHistory())}
              sx={{ mt: 1 }}
            >
              Clear History
            </Button>
          )}
        </Collapse>
      </Box>
    </Paper>
  );
}
