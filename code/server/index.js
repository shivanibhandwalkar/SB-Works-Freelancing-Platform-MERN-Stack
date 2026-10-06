import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import http from 'http';
import { Server } from 'socket.io';
import SocketHandler from './SocketHandler.js';
import { Freelancer, User, Project, Application } from './Schema.js';

const app = express();
const PORT = process.env.PORT || 6001;

// Allowed frontend origins (CLIENT_URL from .env plus both local ports 3000 & 3001)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

// === Middleware ===
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// === Server + Socket Setup ===
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 User connected to Socket.io');
  SocketHandler(socket);
});

// Helper: never send the password hash to the browser
const safeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

// === ROUTES ===

// Health check
app.get('/', (req, res) => res.send('Freelancing API is running'));

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    if (!username || !email || !password || !usertype) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (!['client', 'freelancer'].includes(usertype)) {
      return res.status(400).json({ msg: 'Invalid user type' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: passwordHash, usertype });
    const user = await newUser.save();

    if (usertype === 'freelancer') {
      const newFreelancer = new Freelancer({ userId: user._id });
      await newFreelancer.save();
    }

    res.status(200).json(safeUser(user));
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.status(200).json(safeUser(user));
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// === Project Routes ===
app.post('/new-project', async (req, res) => {
  try {
    const { 
      clientId, clientName, clientEmail, 
      title, description, budget, skills, deadline 
    } = req.body;

    if (!title || !description || !budget || !clientId) {
      return res.status(400).json({ msg: 'Required project fields are missing' });
    }

    const newProject = new Project({
      clientId,
      clientName,
      clientEmail,
      title,
      description,
      budget: Number(budget),
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      deadline: deadline || '',
      status: 'Available',
      postedDate: new Date().toLocaleDateString()
    });

    const savedProject = await newProject.save();
    res.status(200).json(savedProject);
  } catch (err) {
    console.error('Create project error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetch-projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// === Application Routes ===
app.get('/fetch-applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    console.error('Fetch applications error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/new-application', async (req, res) => {
  try {
    const { 
      projectId, clientId, clientName, clientEmail, 
      freelancerId, freelancerName, freelancerEmail, 
      title, description, budget, proposal, bidAmount, 
      estimatedTime, requiredSkills, freelancerSkills 
    } = req.body;

    const newApp = new Application({
      projectId, 
      clientId, 
      clientName, 
      clientEmail, 
      freelancerId, 
      freelancerName, 
      freelancerEmail, 
      title, 
      description, 
      budget, 
      proposal, 
      bidAmount,
      estimatedTime: estimatedTime || '',
      requiredSkills: requiredSkills || [],
      freelancerSkills: freelancerSkills || [],
      status: 'Pending'
    });

    const savedApp = await newApp.save();
    res.status(200).json(savedApp);
  } catch (err) {
    console.error('New application error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// === Approve Application Route ===
app.get('/approve-application/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApp = await Application.findByIdAndUpdate(
      id, 
      { status: 'Approved' }, 
      { new: true }
    );
    if (!updatedApp) return res.status(404).json({ msg: 'Application not found' });
    res.status(200).json(updatedApp);
  } catch (err) {
    console.error('Approve application error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// === Reject Application Route ===
app.get('/reject-application/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApp = await Application.findByIdAndUpdate(
      id, 
      { status: 'Rejected' }, 
      { new: true }
    );
    if (!updatedApp) return res.status(404).json({ msg: 'Application not found' });
    res.status(200).json(updatedApp);
  } catch (err) {
    console.error('Reject application error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all users (password hashes excluded)
app.get('/fetch-users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch users error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// === MongoDB Connection and Server Start ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ MongoDB connection failed:', e.message);
  });