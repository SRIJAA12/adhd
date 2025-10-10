import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { detectFace, loadFaceModels } from '../../utils/faceApi';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function FaceRecognition({ onCapture, mode = 'login' }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    setStatus('loading-models');
    const modelsLoaded = await loadFaceModels();
    
    if (!modelsLoaded) {
      setError('Failed to load face recognition models');
      setStatus('error');
      return;
    }

    setStatus('requesting-camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('ready');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please allow camera permissions.');
      setStatus('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // FIXED: Removed space in function name
  const captureFace = async () => {
    if (!videoRef.current || status !== 'ready') return;

    setLoading(true);
    setError('');

    try {
      const detection = await detectFace(videoRef.current);

      if (!detection) {
        setError('No face detected. Please ensure your face is clearly visible.');
        setLoading(false);
        return;
      }

      const descriptor = Array.from(detection.descriptor);
      onCapture(descriptor);
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture face. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 400,
          margin: '0 auto',
          mb: 2
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            borderRadius: '12px',
            border: '3px solid #667eea',
            background: '#000'
          }}
        />
        
        {status === 'loading-models' && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 2,
              borderRadius: 2
            }}
          >
            <CircularProgress size={30} sx={{ color: 'white', mb: 1 }} />
            <Typography variant="body2">Loading models...</Typography>
          </Box>
        )}

        {status === 'requesting-camera' && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 2,
              borderRadius: 2
            }}
          >
            <Typography variant="body2">Requesting camera access...</Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CameraAltIcon />}
        onClick={captureFace}
        disabled={status !== 'ready' || loading}
        sx={{
          py: 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 700
        }}
      >
        {loading ? 'Processing...' : mode === 'signup' ? 'Capture Face for Signup' : 'Login with Face'}
      </Button>
    </Box>
  );
}
