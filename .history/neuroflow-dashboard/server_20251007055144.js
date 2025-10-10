import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "48814f5ac1814995f84846a7ccc4e16d";

// MongoDB connection (update URI for your DB)
mongoose.connect("mongodb+srv://srijaaanandhan12_db_user:7TZW3nu4Rs6O49W6@cluster0.wq31dbf.mongodb.net/neuroflow_db?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// Define User schema and model with faceDescriptor field
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  faceDescriptor: { type: [Number], default: null },
  adhdSubtype: { type: String, enum: ['inattentive', 'hyperactive', 'combined'], default: 'combined' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

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
        adhdSubtype: matchedUser.adhdSubtype
      }
    });
  } catch (err) {
    console.error('Face login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Face Signup API
app.post('/api/signup/face', async (req, res) => {
  const { username, email, descriptor, adhdSubtype } = req.body;
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
      adhdSubtype: adhdSubtype || 'combined'
    });
    await newUser.save();
    res.json({ message: 'Registration successful', username: newUser.username });
  } catch (err) {
    console.error('Face signup error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
