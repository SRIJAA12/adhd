import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  LinearProgress,
  Chip,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, updateScore, winGame } from '../../store/slices/memorySlice';
import { addPoints } from '../../store/slices/gamificationSlice';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍒'];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateCards = (difficulty) => {
  let pairCount = 6;
  if (difficulty === 'medium') pairCount = 8;
  if (difficulty === 'hard') pairCount = 10;

  const selectedEmojis = emojis.slice(0, pairCount);
  const pairs = [...selectedEmojis, ...selectedEmojis];
  const shuffled = shuffleArray(pairs);

  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

export default function MemoryGames() {
  const dispatch = useDispatch();
  const { gamesPlayed, gamesWon, highScore, difficulty } = useSelector(
    (state) => state.memory
  );

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && !gameWon) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameWon]);

  const handleStartGame = () => {
    const newCards = generateCards(difficulty);
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setGameStarted(true);
    setGameWon(false);
    setTimerActive(true);
    dispatch(startGame());
  };

  const handleCardClick = (clickedCard) => {
    if (
      flippedCards.length === 2 ||
      clickedCard.isMatched ||
      clickedCard.isFlipped
    ) {
      return;
    }

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      if (newFlippedCards[0].emoji === newFlippedCards[1].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.emoji === newFlippedCards[0].emoji
              ? { ...card, isMatched: true }
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);

          // Check if game is won
          if (matchedCards.every((card) => card.isMatched)) {
            handleGameWon();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === newFlippedCards[0].id ||
            card.id === newFlippedCards[1].id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameWon = () => {
    setGameWon(true);
    setTimerActive(false);
    dispatch(winGame());
    
    const score = Math.max(1000 - moves * 10 - time * 2, 100);
    dispatch(updateScore(score));
    dispatch(addPoints(50));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const matchedCount = cards.filter((card) => card.isMatched).length / 2;
  const totalPairs = cards.length / 2;
  const progress = totalPairs > 0 ? (matchedCount / totalPairs) * 100 : 0;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              🧠 Memory Challenge
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Match all pairs to win! Improve focus and memory.
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Chip label={`Games: ${gamesPlayed}`} color="primary" />
            <Chip label={`Wins: ${gamesWon}`} color="success" />
            <Chip label={`Best: ${highScore}`} color="warning" />
          </Box>
        </Box>

        {gameWon && (
          <Alert
            severity="success"
            icon={<EmojiEventsIcon />}
            sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}
          >
            🎉 Congratulations! You won in {moves} moves and {formatTime(time)}!
          </Alert>
        )}

        {gameStarted && !gameWon && (
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Progress: {matchedCount}/{totalPairs} pairs
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {progress.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 10, borderRadius: 2 }}
            />
          </Box>
        )}

        <Box display="flex" gap={2} mb={3}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            startIcon={gameStarted ? <RestartAltIcon /> : null}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700,
              px: 4,
            }}
          >
            {gameStarted ? 'Restart Game' : 'Start Game'}
          </Button>
          {gameStarted && (
            <Box display="flex" gap={3} alignItems="center">
              <Chip label={`Moves: ${moves}`} size="large" />
              <Chip label={`Time: ${formatTime(time)}`} size="large" color="primary" />
            </Box>
          )}
        </Box>

        {gameStarted && (
          <Grid container spacing={2}>
            {cards.map((card) => (
              <Grid item xs={3} sm={2} md={1.5} key={card.id}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card)}
                  sx={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: card.isMatched ? 'default' : 'pointer',
                    background: card.isMatched
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : card.isFlipped
                      ? '#ffffff'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: card.isFlipped || card.isMatched ? '#000' : '#fff',
                    border: card.isFlipped ? '2px solid #667eea' : 'none',
                    transition: 'all 0.3s',
                    opacity: card.isMatched ? 0.7 : 1,
                  }}
                >
                  <CardContent sx={{ p: 0, textAlign: 'center' }}>
                    {card.isFlipped || card.isMatched ? (
                      <Typography variant="h3">{card.emoji}</Typography>
                    ) : (
                      <Typography variant="h4" fontWeight={700}>
                        ?
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!gameStarted && (
          <Box textAlign="center" py={6}>
            <Typography variant="h2" mb={2}>
              🎮
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Click "Start Game" to begin your memory challenge!
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
