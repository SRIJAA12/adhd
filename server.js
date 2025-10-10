import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// MongoDB connection (optional - app works without it)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/neuroflow_db";
mongoose.connect(MONGODB_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
  console.log("⚠️  MongoDB not connected (app will work without database)");
  console.log("   To use database features, start MongoDB or use MongoDB Atlas");
});

// Define User schema and model with avatar and faceDescriptor field
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  avatar: { type: String, default: '' },
  faceDescriptor: { type: [Number], default: null },
  adhdSubtype: { type: String, enum: ['inattentive', 'hyperactive', 'combined'], default: 'combined' },
  pronouns: { type: String, default: '' },
  ageGroup: { type: String, enum: ['child', 'teen', 'adult', 'senior'], default: 'adult' },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Get profile route
app.get('/api/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile route
app.put('/api/profile/:id', async (req, res) => {
  const { username, email, avatar, pronouns, ageGroup } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ error: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    user.pronouns = pronouns || user.pronouns;
    user.ageGroup = ageGroup || user.ageGroup;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Euclidean distance helper
function euclideanDistance(desc1, desc2) {
  if (!desc1 || !desc2 || desc1.length !== desc2.length) {
    return Infinity;
  }
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += (desc1[i] - desc2[i]) ** 2;
  }
  return Math.sqrt(sum);
}

// Face Login API
app.post('/api/login/face', async (req, res) => {
  const { descriptor } = req.body;
  if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: 'Invalid face descriptor' });
  }

  try {
    const users = await User.find({ faceDescriptor: { $ne: null } });
    if (users.length === 0) return res.status(401).json({ error: 'No registered faces found' });

    const THRESHOLD = 0.4; // Lowered threshold for stricter matching
    let matchedUser = null;
    let minDist = Infinity;

    for (const user of users) {
      const dist = euclideanDistance(descriptor, user.faceDescriptor);
      console.log(`Distance for ${user.username}: ${dist}`);

      if (dist < THRESHOLD && dist < minDist) {
        minDist = dist;
        matchedUser = user;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ error: 'Face not recognized' });
    }

    const token = jwt.sign({
      id: matchedUser._id,
      username: matchedUser.username,
      email: matchedUser.email
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: matchedUser._id,
        username: matchedUser.username,
        email: matchedUser.email,
        adhdSubtype: matchedUser.adhdSubtype,
        avatar: matchedUser.avatar,
        pronouns: matchedUser.pronouns,
        ageGroup: matchedUser.ageGroup,
        points: matchedUser.points
      }
    });
  } catch (err) {
    console.error('Face login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Face Signup API
app.post('/api/signup/face', async (req, res) => {
  const { username, email, descriptor, adhdSubtype, avatar, pronouns, ageGroup } = req.body;
  if (!username || !email || !descriptor) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: 'Invalid face descriptor format' });
  }

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: existing.username === username ? 'Username taken' : 'Email registered' });
    }
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      faceDescriptor: descriptor,
      adhdSubtype: adhdSubtype || 'combined',
      avatar: avatar || '',
      pronouns: pronouns || '',
      ageGroup: ageGroup || 'adult',
      points: 0,
    });
    await newUser.save();
    res.json({ message: 'Registration successful', username: newUser.username });
  } catch (err) {
    console.error('Face signup error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Update user points
app.put('/api/users/:id/points', async (req, res) => {
  const { points } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.points = points;
    await user.save();
    res.json({ message: 'Points updated', points: user.points });
  } catch (err) {
    console.error('Points update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add points to user
app.post('/api/users/:id/points/add', async (req, res) => {
  const { points } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.points = (user.points || 0) + points;
    await user.save();
    res.json({ message: 'Points added', points: user.points });
  } catch (err) {
    console.error('Add points error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Email Signup API
app.post('/api/signup/email', async (req, res) => {
  const { name, email, ageGroup, pronouns, avatar } = req.body;
  
  // Validate inputs
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existing = await User.findOne({ $or: [{ username: name }, { email }] });
    if (existing) {
      return res.status(400).json({ error: existing.username === name ? 'Username taken' : 'Email registered' });
    }

    const newUser = new User({
      username: name,
      email: email.trim().toLowerCase(),
      ageGroup: ageGroup || 'adult',
      points: 0,  // Reset points to 0 for new users
      pronouns: pronouns || '',
      avatar: avatar || '',
    });

    await newUser.save();
    res.json({ message: 'Registration successful', username: newUser.username });
  } catch (err) {
    console.error('Email signup error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Chatbot endpoint
app.post('/api/chatbot/message', async (req, res) => {
  const { message, conversationHistory } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const responses = {
      'overwhelmed': {
        response: "I hear you. Feeling overwhelmed is really common with ADHD. Let's break this down:\n\n1. Take 3 deep breaths right now\n2. Write down just ONE thing you need to do\n3. Set a timer for 10 minutes\n4. Do that one thing\n\nYou don't have to do everything at once. 💙",
        suggestions: ['Tell me about the STOP method', 'I need a break', 'Help me prioritize']
      },
      'start': {
        response: "Task initiation struggles are SO real with ADHD. Here's what can help:\n\n✨ The 2-Minute Rule: Just commit to 2 minutes\n✨ Body doubling: Work alongside someone\n✨ Make it tiny: Break it into the smallest possible step\n\nWhat's the tiniest first step you could take?",
        suggestions: ['I still can\'t start', 'Tell me more about body doubling', 'What if I get distracted?']
      },
      'breathing': {
        response: "Let's do a quick breathing exercise together:\n\n🌬 Breathe in for 4 counts\n⏸ Hold for 4 counts\n🌬 Breathe out for 6 counts\n\nRepeat 3 times. I'll wait here for you. 💙\n\nHow do you feel now?",
        suggestions: ['Better, thank you', 'Still anxious', 'Tell me more techniques']
      },
      'time': {
        response: "Time blindness is a core ADHD challenge. Here are some strategies:\n\n⏰ Use visual timers (Time Timer app)\n⏰ Set multiple alarms\n⏰ Time-block your day\n⏰ Use the Pomodoro technique\n\nWhat time management challenge are you facing right now?",
        suggestions: ['I lose track during tasks', 'I\'m always late', 'I underestimate time']
      },
      'rejected': {
        response: "Rejection Sensitive Dysphoria (RSD) is so painful. I'm sorry you're feeling this way. 💔\n\nRemember:\n• Your feelings are valid\n• RSD makes criticism feel 10x worse\n• This feeling will pass\n• You are not your mistakes\n\nWhat happened that triggered this feeling?",
        suggestions: ['Someone criticized me', 'I made a mistake', 'I feel like a failure']
      },
      'default': {
        response: "I'm here to support you with ADHD challenges. I can help with:\n\n• Emotional regulation\n• Task initiation\n• Time management\n• Dealing with RSD\n• Focus strategies\n• Breaking down tasks\n\nWhat would you like to talk about?",
        suggestions: ['I feel overwhelmed', 'I can\'t focus', 'Help with a task']
      }
    };

    // Simple keyword matching
    let response = responses.default;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('overwhelm') || lowerMessage.includes('too much') || lowerMessage.includes('stressed') || lowerMessage.includes('stress')) {
      response = responses.overwhelmed;
    } else if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('initiat') || lowerMessage.includes('can\'t start') || lowerMessage.includes('cannot start') || lowerMessage.includes('stuck')) {
      response = responses.start;
    } else if (lowerMessage.includes('breath') || lowerMessage.includes('calm') || lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('panic')) {
      response = responses.breathing;
    } else if (lowerMessage.includes('time') || lowerMessage.includes('late') || lowerMessage.includes('deadline') || lowerMessage.includes('lost track')) {
      response = responses.time;
    } else if (lowerMessage.includes('reject') || lowerMessage.includes('rsd') || lowerMessage.includes('critic') || lowerMessage.includes('feel rejected') || lowerMessage.includes('hurt')) {
      response = responses.rejected;
    }

    res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      response: "I'm having trouble right now, but I'm still here for you. 💙",
      suggestions: []
    });
  }
});

// Serve static files from React build
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'neuroflow-dashboard/dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'neuroflow-dashboard/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chatbot ready!`);
  console.log(`Frontend served from: ${path.join(__dirname, 'neuroflow-dashboard/dist')}`);
});

/* REMOVED - Not needed anymore
// Intelligent fallback response generator
function generateIntelligentResponse(message, user, conversationHistory) {
  const lowerMessage = message.toLowerCase();
  const username = user.username || 'friend';
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening|sup|yo)$/i)) {
    return {
      response: `Hey ${username}! 👋 Great to see you here.

I'm NeuroFlow, your ADHD support companion. I'm here to help you navigate the unique challenges of living with ADHD - without any judgment.

**I can help with:**
• 😰 Feeling overwhelmed or stressed
• 🚫 Task paralysis (can't get started)
• ⏰ Time blindness and being late
• 💔 RSD (Rejection Sensitive Dysphoria)
• 🎯 Focus and concentration issues
• 🌬️ Breathing exercises and calming down
• 💪 Motivation and encouragement

What's on your mind today?`,
      suggestions: ['I feel overwhelmed', 'I can\'t start a task', 'Tell me about ADHD']
    };
  }

  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return {
      response: `You're so welcome, ${username}! 💙

I'm really glad I could help. Remember, reaching out for support is a sign of strength, not weakness. You're doing great by taking care of yourself.

Is there anything else you'd like to talk about?`,
      suggestions: ['I need more help', 'Tell me something encouraging', 'I\'m good for now']
    };
  }

  // ADHD information
  if (lowerMessage.includes('what is adhd') || lowerMessage.includes('tell me about adhd') || lowerMessage.includes('explain adhd')) {
    return {
      response: `${username}, ADHD (Attention-Deficit/Hyperactivity Disorder) is a neurodevelopmental condition that affects how your brain works. 🧠

**Key things to know:**
• It's NOT a character flaw or laziness
• Your brain has different dopamine regulation
• Executive function works differently
• You're not broken - you're wired differently

**Common ADHD challenges:**
• Executive dysfunction (planning, organizing)
• Time blindness (losing track of time)
• Emotional dysregulation (big feelings)
• Task initiation (hard to start things)
• Hyperfocus (getting stuck on one thing)
• RSD (Rejection Sensitive Dysphoria)

**The good news:**
• ADHD brains are creative and innovative
• You can hyperfocus on things you love
• With the right strategies, you can thrive
• You're not alone - millions have ADHD

What specific aspect would you like to know more about?`,
      suggestions: ['Tell me about RSD', 'How do I manage ADHD?', 'I feel different from everyone']
    };
  }

  // Overwhelm/Stress/Anxiety
  if (lowerMessage.includes('overwhelm') || lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('panic') || lowerMessage.includes('too much')) {
    return {
      response: `I hear you, ${username}. Feeling overwhelmed is so valid, especially with an ADHD brain. 💙

Let's try the **STOP method** right now:
• **S**top - Pause what you're doing
• **T**ake a breath - Deep breath in for 4, hold for 4, out for 4
• **O**bserve - Notice what you're feeling without judgment
• **P**roceed - Choose one tiny action

Your feelings are real and they matter. ADHD brains can get flooded with emotions and tasks. Let's break this down together.

What's the ONE thing causing the most stress right now?`,
      suggestions: ['I have too many tasks', 'I feel like I\'m failing', 'I need breathing exercises']
    };
  }
  
  // Specific task help
  if (lowerMessage.includes('break down') || lowerMessage.includes('how do i') || lowerMessage.includes('help me with')) {
    return {
      response: `Absolutely, ${username}! Let's break this down into ADHD-friendly steps. 🎯

**The ADHD Task Breakdown Method:**

1. **Make it TINY** - What's the absolute smallest first step?
   Example: Instead of "clean room" → "pick up 3 things"

2. **Set a timer** - Just 5 minutes. That's it.
   You can do ANYTHING for 5 minutes!

3. **Remove barriers** - Gather everything you need FIRST
   Phone away, water nearby, tools ready

4. **Body double** - Work with someone (even on video)
   Their presence creates accountability

5. **Reward yourself** - After each tiny step, celebrate!
   Dance, snack, stretch - dopamine boost!

Tell me what specific task you're working on, and I'll help you break it down into even smaller steps!`,
      suggestions: ['I need to study', 'I need to clean', 'I have a work project']
    };
  }

  // Task initiation/Procrastination
  if (lowerMessage.includes('can\'t start') || lowerMessage.includes('cannot start') || lowerMessage.includes('procrastinat') || lowerMessage.includes('stuck') || lowerMessage.includes('paralyz') || lowerMessage.includes('don\'t know where to start')) {
    return {
      response: `${username}, task paralysis is SO common with ADHD - you're not lazy, your brain just needs a different approach. 🌟

Here's what helps:
1. **Make it ridiculously small** - Instead of "write report", try "open document"
2. **Body doubling** - Work alongside someone (even on video call)
3. **Set a 5-minute timer** - Just 5 minutes, that's it
4. **Remove barriers** - Gather everything you need first

The hardest part is starting. Once you begin, momentum often kicks in.

What task are you trying to start?`,
      suggestions: ['Break down my task', 'Tell me about body doubling', 'I need motivation']
    };
  }
  
  // Time blindness
  if (lowerMessage.includes('time') || lowerMessage.includes('late') || lowerMessage.includes('forgot') || lowerMessage.includes('deadline')) {
    return {
      response: `Time blindness is a real ADHD challenge, ${username}. Your brain doesn't track time the same way. ⏰

**Strategies that help:**
• **Visual timers** - See time passing (Time Timer app)
• **Alarms for everything** - Transitions, tasks, breaks
• **Time blocking** - Schedule specific times for tasks
• **Pomodoro** - 25 min work, 5 min break (makes time concrete)
• **Buffer time** - Always add 50% more time than you think

Pro tip: Set alarms 15 min BEFORE you need to leave, not when you need to leave.

What time-related challenge are you facing?`,
      suggestions: ['Set up a routine', 'Pomodoro technique', 'I\'m always late']
    };
  }
  
  // RSD (Rejection Sensitive Dysphoria)
  if (lowerMessage.includes('reject') || lowerMessage.includes('rsd') || lowerMessage.includes('critic') || lowerMessage.includes('hurt') || lowerMessage.includes('sensitive')) {
    return {
      response: `${username}, what you're feeling is RSD (Rejection Sensitive Dysphoria) - it's a real part of ADHD. Your pain is valid. 💔

**Remember:**
• Your brain amplifies perceived rejection
• The intensity of feeling ≠ reality of situation
• This feeling WILL pass (even though it feels permanent)
• You are worthy, even when your brain says otherwise

**Right now:**
1. Name it: "This is RSD, not reality"
2. Reach out to someone safe
3. Do something kind for yourself
4. Remember past times you felt this way and survived

You're not "too sensitive" - your brain is wired differently. That's not a flaw.

Want to talk about what triggered this?`,
      suggestions: ['I feel like everyone hates me', 'I need validation', 'Reframe negative thoughts']
    };
  }
  
  // Focus/Distraction/Hyperfocus
  if (lowerMessage.includes('focus') || lowerMessage.includes('distract') || lowerMessage.includes('hyperfocus') || lowerMessage.includes('concentrate')) {
    return {
      response: `${username}, ADHD focus is like a spotlight - either too narrow (hyperfocus) or too wide (distraction). Let's work with your brain. 🎯

**For better focus:**
• **Remove distractions first** - Phone away, close tabs, quiet space
• **Pomodoro technique** - 25 min focus, 5 min break
• **Body doubling** - Work with someone present
• **Music/white noise** - Some ADHD brains focus better with sound
• **Fidget tools** - Give your body something to do

**Managing hyperfocus:**
• Set alarms for breaks
• Keep water/snacks nearby
• Schedule hyperfocus time when possible

Your brain CAN focus - it just needs the right conditions.

What's making it hard to focus right now?`,
      suggestions: ['I keep getting distracted', 'Managing hyperfocus', 'I can\'t concentrate']
    };
  }
  
  // Motivation/Encouragement
  if (lowerMessage.includes('motivat') || lowerMessage.includes('encouragement') || lowerMessage.includes('give up')) {
    return {
      response: `${username}, I see you fighting. That takes real strength. 💪

**You're doing better than you think:**
• You showed up today - that counts
• You're trying strategies - that's growth
• You're asking for help - that's wisdom
• Progress isn't linear - setbacks are part of the journey

**Quick motivation boost:**
1. Think of ONE thing you did today (even getting out of bed counts!)
2. That's your win. Celebrate it.
3. Tomorrow is a fresh start

Your ADHD brain needs extra dopamine and external motivation. That's not weakness - it's just how you're wired.

What small win can you celebrate right now?`,
      suggestions: ['I need help with a task', 'Tell me about dopamine', 'I feel like I\'m failing']
    };
  }
  
  // Emotional support/validation (more specific now)
  if (lowerMessage.includes('fail') || lowerMessage.includes('bad at') || lowerMessage.includes('not good enough')) {
    return {
      response: `${username}, those thoughts are lying to you. Let me tell you the truth. 💙

**The truth:**
• You're not failing - you're navigating life with a different operating system
• ADHD makes things harder, not impossible
• Struggling ≠ failing
• You ARE good enough, exactly as you are

**Reframe these thoughts:**
• "I'm failing" → "I'm learning what works for my brain"
• "I'm not good enough" → "I'm doing my best with the tools I have"
• "Everyone else can do this" → "Everyone has different challenges"

You're being harder on yourself than you'd ever be on a friend. What would you tell a friend feeling this way?`,
      suggestions: ['I need validation', 'How do I stop negative thoughts?', 'Tell me something positive']
    };
  }
  
  // Breathing exercises
  if (lowerMessage.includes('breath') || lowerMessage.includes('calm') || lowerMessage.includes('relax')) {
    return {
      response: `Let's do this together, ${username}. 🌬️

**Box Breathing (do with me now):**
1. Breathe IN for 4 counts (1...2...3...4)
2. HOLD for 4 counts (1...2...3...4)
3. Breathe OUT for 4 counts (1...2...3...4)
4. HOLD for 4 counts (1...2...3...4)

Repeat 4 times.

**Why this works:** It activates your parasympathetic nervous system, telling your body "we're safe."

**Other techniques:**
• 4-7-8 breathing (in 4, hold 7, out 8)
• Hand on heart, deep breaths
• Humming while exhaling (stimulates vagus nerve)

How are you feeling now?`,
      suggestions: ['Better, thank you', 'Still anxious', 'What else can help?']
    };
  }
  
  // Study help
  if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('homework')) {
    return {
      response: `${username}, studying with ADHD requires special strategies! 📚

**ADHD-Friendly Study Method:**

1. **Pomodoro Power** - 25 min study, 5 min break
   Set a visible timer!

2. **Active Learning** - Don't just read
   • Teach it out loud
   • Make flashcards
   • Draw diagrams
   • Quiz yourself

3. **Body Doubling** - Study with someone (even on video)
   Accountability = focus

4. **Movement Breaks** - Every 25 minutes:
   • Jump jacks
   • Walk around
   • Stretch
   • Dance!

5. **Fidget Tools** - Give your hands something to do
   Stress ball, fidget spinner, doodle

6. **Music/White Noise** - Some ADHD brains focus better with sound
   Try lo-fi beats or brown noise

What subject are you studying? I can give you specific tips!`,
      suggestions: ['I can\'t focus while studying', 'I keep forgetting what I read', 'I have an exam tomorrow']
    };
  }

  // Cleaning/organizing
  if (lowerMessage.includes('clean') || lowerMessage.includes('organize') || lowerMessage.includes('messy') || lowerMessage.includes('clutter')) {
    return {
      response: `${username}, cleaning with ADHD is HARD. Let's make it easier! 🧹

**The ADHD Cleaning Method:**

1. **One Room Rule** - Pick ONE room. That's it.
   Don't even look at other rooms!

2. **5-Minute Sprints** - Set timer for 5 minutes
   • Pick up 10 things
   • Put them where they belong
   • STOP when timer goes off
   • Take a break!

3. **Body Doubling** - Clean with someone (or on video call)
   Makes it way less boring!

4. **Music Power** - Upbeat playlist
   Makes cleaning feel like dancing!

5. **Reward System** - After each sprint:
   • Snack
   • TikTok video
   • Stretch
   • Whatever motivates YOU!

6. **Don't Aim for Perfect** - "Good enough" is GREAT
   Progress > Perfection

Which room are you tackling first?`,
      suggestions: ['My bedroom is a disaster', 'I don\'t know where to start', 'I get distracted while cleaning']
    };
  }

  // Work/productivity
  if (lowerMessage.includes('work project') || lowerMessage.includes('deadline') || lowerMessage.includes('meeting') || lowerMessage.includes('presentation')) {
    return {
      response: `${username}, work with ADHD requires smart strategies! 💼

**ADHD Work Productivity System:**

1. **Time Blocking** - Schedule SPECIFIC times
   "9-9:30am: Email" not "morning: email"

2. **Eat the Frog** - Hardest task FIRST
   When your brain is freshest

3. **Pomodoro Method** - 25 min work, 5 min break
   Use a visible timer!

4. **Body Doubling** - Work alongside colleague (even virtually)
   Accountability helps focus

5. **Remove Distractions:**
   • Phone in another room
   • Close unnecessary tabs
   • Headphones on (even if no music)
   • "Do Not Disturb" mode

6. **External Brain** - Write EVERYTHING down
   Don't trust your memory!

7. **Buffer Time** - Add 50% more time than you think
   ADHD time estimation is notoriously off

What's your biggest work challenge right now?`,
      suggestions: ['I miss deadlines', 'I can\'t focus in meetings', 'I forget important tasks']
    };
  }

  // Sleep issues
  if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia') || lowerMessage.includes('can\'t sleep')) {
    return {
      response: `${username}, ADHD and sleep issues go hand-in-hand. Let's fix this! 😴

**ADHD Sleep Strategies:**

1. **Consistent Bedtime** - Same time EVERY night
   Your ADHD brain needs routine!

2. **Wind-Down Ritual** (1 hour before bed):
   • Dim lights
   • No screens (blue light = awake brain)
   • Calming activity (reading, stretching)
   • Warm shower

3. **Brain Dump** - Write down tomorrow's tasks
   Get them OUT of your head!

4. **White Noise** - Blocks racing thoughts
   Fan, app, or sound machine

5. **Medication Timing** - If you take ADHD meds
   Talk to doctor about timing

6. **No Caffeine After 2pm** - It stays in your system!

7. **Exercise** - But not within 3 hours of bed
   Helps regulate sleep

8. **Melatonin** - Can help (ask your doctor)
   Take 30-60 min before bed

What's keeping you awake?`,
      suggestions: ['My brain won\'t shut off', 'I can\'t wake up in the morning', 'I\'m always tired']
    };
  }

  // Default empathetic response
  return {
    response: `I'm listening, ${username}. 💙

I can tell you're reaching out for support, and that takes courage. ADHD can make so many things harder, but you're not alone in this.

**I can help with:**
• 😰 Feeling overwhelmed or stressed
• 🚫 Task paralysis (can't get started)
• ⏰ Time blindness and being late
• 💔 RSD (Rejection Sensitive Dysphoria)
• 🎯 Focus and concentration
• 📚 Study strategies
• 🧹 Cleaning and organizing
• 💼 Work productivity
• 😴 Sleep issues
• 💪 Motivation and encouragement

What's on your mind? I'm here without judgment, and I understand how ADHD makes things harder.`,
    suggestions: ['I need help with a task', 'I\'m feeling overwhelmed', 'Tell me about ADHD']
  };
}

// Helper function to generate contextual suggestions
function generateSuggestions(userMessage, botResponse) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('overwhelm') || lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
    return ['Teach me the STOP method', 'I need breathing exercises', 'Help me prioritize'];
  }
  
  if (lowerMessage.includes('task') || lowerMessage.includes('start') || lowerMessage.includes('procrastinat')) {
    return ['Break down this task', 'I need motivation', 'Tell me about body doubling'];
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('late') || lowerMessage.includes('forgot')) {
    return ['Help with time blindness', 'Set up reminders', 'Pomodoro technique'];
  }
  
  if (lowerMessage.includes('reject') || lowerMessage.includes('rsd') || lowerMessage.includes('critic')) {
    return ['Tell me about RSD', 'I need validation', 'Reframe negative thoughts'];
  }
  
  if (lowerMessage.includes('focus') || lowerMessage.includes('distract') || lowerMessage.includes('hyperfocus')) {
    return ['Help me focus', 'Managing hyperfocus', 'Dealing with distractions'];
  }
  
  // Default suggestions
  return ['Tell me more', 'I need another strategy', 'How do I maintain this?'];
}
*/
