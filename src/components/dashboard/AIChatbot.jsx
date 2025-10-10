import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer, Box, Typography, TextField, IconButton, Paper, CircularProgress, Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = 'http://localhost:5000';

export default function AIChatbot({ open, onClose }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! 👋\n\nI\'m your ADHD support companion. I understand that your brain works differently, and I\'m here to help—not judge. 🌟\n\nI can help with:\n• Emotional regulation & STOP method\n• Task initiation struggles\n• Time blindness support\n• Dealing with RSD\n• Hyperfocus management\n\nWhat\'s on your mind today?',
      suggestions: ['I need help with a task', 'I\'m feeling overwhelmed', 'Tell me about ADHD strategies']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (messageText = null) => {
    const message = messageText || input.trim();
    if (!message) return;

    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setConversationHistory((prev) => [...prev, { isUser: true, content: message }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.slice(-10)
        })
      });

      if (!response.ok) {
        throw new Error('Chatbot service unavailable');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        suggestions: data.suggestions || []
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setConversationHistory((prev) => [...prev, { isUser: false, content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now, but I\'m still here for you. 💙\n\nRemember: What you\'re feeling is valid. Try some deep breathing, and we can reconnect soon.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight={700}>🧠 NeuroFlow Support</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ p: 1.5, bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: 1, overflowX: 'auto' }}>
          {['😰 Overwhelmed', '🚫 Can\'t Start', '🌬 Breathing', '⏰ Time Blindness', '💔 RSD'].map((action, idx) => (
            <Chip
              key={idx}
              label={action}
              size="small"
              onClick={() => {
                const messages = [
                  'I feel overwhelmed',
                  'I can\'t start this task',
                  'I need breathing exercises',
                  'I lost track of time',
                  'I feel rejected'
                ];
                sendMessage(messages[idx]);
              }}
              sx={{
                bgcolor: 'white',
                border: '1px solid #667eea',
                color: '#667eea',
                fontSize: '11px',
                '&:hover': {
                  bgcolor: '#667eea',
                  color: 'white'
                }
              }}
            />
          ))}
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f7fa' }}>
          {messages.map((msg, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: msg.role === 'user' ? '#667eea' : 'white',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </Typography>
                </Paper>
              </Box>
              
              {/* Suggestion chips */}
              {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, justifyContent: 'flex-start' }}>
                  {msg.suggestions.map((suggestion, idx) => (
                    <Chip
                      key={idx}
                      label={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        bgcolor: 'white',
                        border: '1px solid #667eea',
                        color: '#667eea',
                        '&:hover': {
                          bgcolor: '#667eea',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}
          {loading && (
            <Box display="flex" justifyContent="flex-start" my={2}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'white', borderRadius: 3 }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.300', bgcolor: 'white' }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
              disabled={loading}
              size="small"
            />
            <IconButton 
              color="primary" 
              onClick={() => sendMessage()} 
              disabled={loading || !input.trim()}
              sx={{
                bgcolor: '#667eea',
                color: 'white',
                '&:hover': { bgcolor: '#764ba2' },
                '&:disabled': { bgcolor: '#ccc' }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
