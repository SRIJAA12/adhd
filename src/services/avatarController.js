import store from '../store/store';
import {
  setAvatarSpeaking,
  setCurrentMessage,
  addMessageToQueue,
  removeMessageFromQueue,
  setAvatarMood,
  addToConversationHistory,
} from '../store/slices/avatarSlice';

class AvatarController {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.isProcessingQueue = false;
  }

  // Core speaking function
  speak(text, options = {}) {
    const state = store.getState().avatar;
    
    if (!state.settings.voiceEnabled) {
      console.log('Avatar (silent):', text);
      return;
    }

    // Cancel any ongoing speech
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || state.settings.voiceRate;
    utterance.pitch = options.pitch || state.settings.voicePitch;
    utterance.volume = options.volume || state.settings.volume;

    // Try to use a female voice if available
    const voices = this.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Zira')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      store.dispatch(setAvatarSpeaking(true));
      store.dispatch(setCurrentMessage(text));
    };

    utterance.onend = () => {
      store.dispatch(setAvatarSpeaking(false));
      store.dispatch(setCurrentMessage(''));
      this.currentUtterance = null;
      
      // Process next message in queue
      setTimeout(() => this.processQueue(), 500);
    };

    utterance.onerror = () => {
      store.dispatch(setAvatarSpeaking(false));
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.speechSynthesis.speak(utterance);

    // Add to conversation history
    store.dispatch(addToConversationHistory({
      message: text,
      type: options.type || 'info',
    }));
  }

  // Add message to queue
  queueMessage(text, priority = 'normal', type = 'info') {
    store.dispatch(addMessageToQueue({ text, priority, type }));
    
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  // Process message queue
  processQueue() {
    const state = store.getState().avatar;
    
    if (state.messageQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    if (state.isSpeaking) {
      return; // Wait for current message to finish
    }

    this.isProcessingQueue = true;
    
    // Sort by priority (high priority first)
    const sortedQueue = [...state.messageQueue].sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const nextMessage = sortedQueue[0];
    if (nextMessage) {
      store.dispatch(removeMessageFromQueue());
      this.speak(nextMessage.text, { type: nextMessage.type });
    }
  }

  // Stop speaking
  stop() {
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
      store.dispatch(setAvatarSpeaking(false));
      store.dispatch(setCurrentMessage(''));
      this.currentUtterance = null;
    }
  }

  // Timer-related messages
  timerStarted(duration) {
    const minutes = Math.floor(duration / 60);
    store.dispatch(setAvatarMood('encouraging'));
    this.speak(
      `Great! I've started a ${minutes}-minute focus timer for you. You've got this! I'll check in with you along the way.`,
      { type: 'timer' }
    );
  }

  timerHalfway(remaining) {
    const minutes = Math.floor(remaining / 60);
    store.dispatch(setAvatarMood('encouraging'));
    this.queueMessage(
      `You're doing amazing! ${minutes} minutes left. Keep that focus going!`,
      'normal',
      'timer'
    );
  }

  timerAlmostDone(remaining) {
    const minutes = Math.floor(remaining / 60);
    store.dispatch(setAvatarMood('encouraging'));
    this.queueMessage(
      `Almost there! Just ${minutes} minutes remaining. You're crushing it!`,
      'normal',
      'timer'
    );
  }

  timerComplete() {
    store.dispatch(setAvatarMood('celebrating'));
    this.queueMessage(
      `Fantastic work! You completed your focus session! Take a well-deserved break, or shall we tackle the next task?`,
      'high',
      'timer'
    );
  }

  // Task-related messages
  taskReminder(taskName) {
    store.dispatch(setAvatarMood('concerned'));
    this.queueMessage(
      `Hey, just a gentle reminder about "${taskName}". No pressure, but I believe in you! Would you like to work on it now?`,
      'normal',
      'task'
    );
  }

  taskIncomplete(taskName) {
    store.dispatch(setAvatarMood('concerned'));
    this.queueMessage(
      `I noticed "${taskName}" isn't finished yet. That's totally okay! ADHD brains work differently. Want to break it into smaller steps together?`,
      'high',
      'task'
    );
  }

  taskCompleted(taskName) {
    store.dispatch(setAvatarMood('celebrating'));
    this.queueMessage(
      `Yes! You completed "${taskName}"! I'm so proud of you! That's a real achievement. Want to celebrate with a quick break?`,
      'high',
      'task'
    );
  }

  taskStarted(taskName) {
    store.dispatch(setAvatarMood('encouraging'));
    this.speak(
      `Perfect! Let's work on "${taskName}" together. Remember, progress over perfection. You're doing great!`,
      { type: 'task' }
    );
  }

  // Emotional support messages
  encouragement() {
    const messages = [
      "You're doing better than you think. ADHD is a challenge, but you're handling it like a champion!",
      "Remember, your brain works differently, not wrongly. You've got unique strengths!",
      "Every small step counts. I'm here with you, and I believe in you!",
      "It's okay to struggle sometimes. What matters is that you keep trying. And you are!",
      "Your effort matters more than the outcome. I see how hard you're working!",
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    store.dispatch(setAvatarMood('happy'));
    this.queueMessage(message, 'normal', 'encouragement');
  }

  overwhelmed() {
    store.dispatch(setAvatarMood('concerned'));
    this.speak(
      "I can see you might be feeling overwhelmed. That's completely valid. Let's take a deep breath together. Breathe in... and out. You're safe, and we'll get through this one step at a time.",
      { type: 'support' }
    );
  }

  breakReminder() {
    store.dispatch(setAvatarMood('happy'));
    this.queueMessage(
      "You've been working hard! How about a quick 5-minute break? Stretch, hydrate, or just rest your eyes. Your brain will thank you!",
      'normal',
      'break'
    );
  }

  // Morning greeting
  morningGreeting() {
    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    if (hour >= 17) greeting = "Good evening";

    store.dispatch(setAvatarMood('happy'));
    this.speak(
      `${greeting}! I'm here to support you today. Remember, you're capable of amazing things, even if your brain works a bit differently. What would you like to focus on?`,
      { type: 'greeting' }
    );
  }

  // Feature overview
  explainFeatures() {
    store.dispatch(setAvatarMood('happy'));
    this.speak(
      "I'm your ADHD support companion! I can help you with timers, remind you about tasks, give you encouragement when you need it, and celebrate your wins. I'll check in with you during focus sessions and help you stay on track. You can adjust my settings anytime!",
      { type: 'info' }
    );
  }

  // Custom message
  customMessage(text, mood = 'happy', priority = 'normal') {
    store.dispatch(setAvatarMood(mood));
    this.queueMessage(text, priority, 'custom');
  }
}

// Create singleton instance
const avatarController = new AvatarController();

// Load voices when available
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

export default avatarController;
