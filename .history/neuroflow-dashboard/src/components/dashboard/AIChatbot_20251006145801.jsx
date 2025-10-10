import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer, Box, Typography, TextField, IconButton, Paper, CircularProgress, Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const OPENAI_API_KEY = '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';

export default function AIChatbot({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your ADHD support assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an empathetic ADHD support assistant. Provide supportive, actionable advice for people with ADHD. Be encouraging, understanding, and practical. Break down complex tasks into simple steps.'
            },
            ...messages,
            userMessage
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
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
            <SmartToyIcon />
            <Typography variant="h6" fontWeight={700}>AI Assistant</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f7fa' }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
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
                <Typography variant="body2">{msg.content}</Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.300', bgcolor: 'white' }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
              size="small"
            />
            <IconButton 
              color="primary" 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
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
