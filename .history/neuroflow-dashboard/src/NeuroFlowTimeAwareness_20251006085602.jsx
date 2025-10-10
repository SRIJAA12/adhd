import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUrgency,
  setTimerActive,
  setFocusMode,
  setSoundPlaying,
  setIntervalCount,
  setWorkDuration,
} from './store/store';

const setLightTheme = () => {
  document.documentElement.style.setProperty('--bg-color', '#f9f9f9');
  document.documentElement.style.setProperty('--text-color', '#222222');
  document.documentElement.style.setProperty('--accent-color', '#6200ee');
  document.documentElement.style.setProperty('--button-bg', '#6200ee');
  document.documentElement.style.setProperty('--button-text', '#ffffff');
  document.documentElement.style.setProperty('--input-bg', '#ffffff');
  document.documentElement.style.setProperty('--input-text', '#000000');
};

const setDarkTheme = () => {
  document.documentElement.style.setProperty('--bg-color', '#121212');
  document.documentElement.style.setProperty('--text-color', '#e0e0e0');
  document.documentElement.style.setProperty('--accent-color', '#bb86fc');
  document.documentElement.style.setProperty('--button-bg', '#333333');
  document.documentElement.style.setProperty('--button-text', '#ffffff');
  document.documentElement.style.setProperty('--input-bg', '#222222');
  document.documentElement.style.setProperty('--input-text', '#eeeeee');
};

const ambientSound = new Howl({
  src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
  volume: 0.3,
  loop: true,
});

function UrgencyBar({ intervalCount, workDuration }) {
  const remaining = Math.max(0, workDuration - intervalCount);
  let bgColor = 'var(--accent-color)';
  if (remaining <= workDuration / 2 && remaining > workDuration / 4) bgColor = '#f1c40f';
  else if (remaining <= workDuration / 4) bgColor = '#e74c3c';

  const fillPercent = Math.min(100, ((workDuration - remaining) / workDuration) * 100);

  return (
    <div
      style={{
        height: '20px',
        width: '100%',
        backgroundColor: 'var(--input-bg)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)',
        border: '1px solid var(--accent-color)',
      }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={workDuration}
      aria-valuenow={workDuration - remaining}
      aria-label="Task urgency progress"
      tabIndex={0}
    >
      <div
        style={{
          height: '100%',
          width: `${fillPercent}%`,
          backgroundColor: bgColor,
          transition: 'width 0.5s ease, background-color 0.5s ease',
        }}
      />
    </div>
  );
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

function sendNotification(title, options) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
}

export default function NeuroFlowTimeAwareness() {
  const dispatch = useDispatch();
  const {
    timerActive,
    focusMode,
    soundPlaying,
    intervalMs,
    workDuration,
    intervalCount,
  } = useSelector(state => state.app);

  const [warningMessage, setWarningMessage] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'light') setLightTheme();
    else setDarkTheme();
  }, [theme]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      const updatedIntervalCount = intervalCount + 1;

      if (updatedIntervalCount >= workDuration) {
        sendNotification('Work time complete!', { body: 'Session ended. Starting over!' });
        dispatch(setTimerActive(false));
        setWarningMessage('Work time completed! Starting over soon...');
        setTimeout(() => {
          dispatch(setUrgency(0));
          dispatch(setIntervalCount(0));
          dispatch(setTimerActive(true));
          setWarningMessage(null);
        }, 2000);
      } else {
        dispatch(setIntervalCount(updatedIntervalCount));
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [timerActive, dispatch, intervalMs, workDuration, intervalCount]);

  useEffect(() => {
    if (soundPlaying) ambientSound.play();
    else ambientSound.pause();
  }, [soundPlaying]);

  const remainingSeconds = Math.max(0, workDuration - intervalCount);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const handleWorkDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      dispatch(setWorkDuration(value * 60));
    }
  };

  const addReminderToGoogleCalendar = () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + workDuration * 1000);
    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const url = `https://calendar.google.com/calendar/r/eventedit?text=NeuroFlow%20Focus%20Session&dates=${formatDate(
      startDate
    )}/${formatDate(endDate)}&details=Focus session with NeuroFlow Timer`;

    window.open(url, '_blank');
  };

  return (
    <main
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '480px',
        margin: '3rem auto',
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        borderRadius: '18px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        position: 'relative',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{
            padding: '6px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            transition: 'background-color 0.3s ease',
          }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
      <h1 style={{ textAlign: 'center' }}>NeuroFlow Time Awareness</h1>

      <section style={{ marginTop: '2rem' }}>
        <label
          style={{
            fontWeight: '600',
            marginBottom: '0.5rem',
            display: 'block',
          }}
        >
          Task Urgency
        </label>
        <UrgencyBar intervalCount={intervalCount} workDuration={workDuration} />

        <div
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center',
            userSelect: 'none',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {minutes}:{formattedSeconds}
        </div>

        {warningMessage && (
          <div
            role="alert"
            style={{
              marginTop: '1rem',
              padding: '10px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '700',
              cursor: 'pointer',
            }}
            onClick={() => setWarningMessage(null)}
          >
            {warningMessage}
          </div>
        )}

        <button
          onClick={() => dispatch(setTimerActive(!timerActive))}
          style={{
            marginTop: '1.5rem',
            padding: '12px 24px',
            fontSize: '1.1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: timerActive ? '#e74c3c' : 'var(--accent-color)',
            color: 'var(--button-text)',
            cursor: 'pointer',
            fontWeight: '700',
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s ease',
          }}
          aria-pressed={timerActive}
          aria-label={timerActive ? 'Pause timer' : 'Start timer'}
        >
          {timerActive ? 'Pause Timer' : 'Start Timer'}
        </button>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <label
          htmlFor="work-duration"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}
        >
          Set Work Duration (minutes)
        </label>
        <input
          id="work-duration"
          type="number"
          min={1}
          value={Math.floor(workDuration / 60)}
          onChange={handleWorkDurationChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--accent-color)',
            fontSize: '1.1rem',
            boxSizing: 'border-box',
            color: 'var(--input-text)',
            backgroundColor: 'var(--input-bg)',
          }}
          aria-label="Set work duration in minutes"
        />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <button
          onClick={addReminderToGoogleCalendar}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1.1rem',
            backgroundColor: '#4285f4',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(66,133,244,0.7)',
            fontWeight: '700',
          }}
          aria-label="Add focus session reminder to Google Calendar"
        >
          Add Reminder to Google Calendar
        </button>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ fontWeight: '700', color: 'var(--text-color)', marginBottom: '0.8rem' }}>
          Sensory & Emotional Regulation
        </h2>
        <button
          onClick={() => dispatch(setSoundPlaying(!soundPlaying))}
          style={{
            width: '100%',
            marginBottom: '1rem',
            padding: '12px',
            fontSize: '1.1rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: soundPlaying ? '#3498db' : '#95a5a6',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(52,152,219,0.5)',
          }}
          aria-pressed={soundPlaying}
          aria-label="Toggle ambient sound"
        >
          {soundPlaying ? 'Pause Ambient Sound' : 'Play Ambient Sound'}
        </button>

        <label
          htmlFor="focus-mode-checkbox"
          style={{ display: 'block', fontWeight: '600', color: 'var(--text-color)' }}
        >
          Focus Mode
        </label>
        <input
          id="focus-mode-checkbox"
          type="checkbox"
          checked={focusMode}
          onChange={e => dispatch(setFocusMode(e.target.checked))}
          aria-checked={focusMode}
          aria-label="Enable or disable focus mode"
          style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
        />
      </section>

      {focusMode && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}
    </main>
  );
}
