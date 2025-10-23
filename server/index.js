import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Import Models
import User from './models/user.model.js';
import Interview from './models/interview.model.js';

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccount = JSON.parse(
  fs.readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors()); 
app.use(express.json());

// Authentication Middleware
const decodeToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ========= API ROUTES =========

// --- User Routes ---
app.post('/api/users/sync', decodeToken, async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseId: req.user.uid },
      { $set: { email, name } },
      { upsert: true, new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- Interview Routes ---

// GET all interviews for the logged-in user
app.get('/api/interviews', decodeToken, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews' });
  }
});

// GET a single interview by its ID
app.get('/api/interviews/:id', decodeToken, async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview' });
  }
});

// POST (Create) a new interview
app.post('/api/interviews', decodeToken, async (req, res) => {
  try {
    const newInterview = new Interview({
      ...req.body,
      userId: req.user.uid,
    });
    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating interview' });
  }
});

// PUT (Update) an existing interview
app.put('/api/interviews/:id', decodeToken, async (req, res) => {
  try {
    const updatedInterview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!updatedInterview) {
      return res.status(404).json({ message: 'Interview not found or unauthorized' });
    }
    res.status(200).json(updatedInterview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating interview' });
  }
});

// DELETE an interview
app.delete('/api/interviews/:id', decodeToken, async (req, res) => {
  try {
    const deletedInterview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!deletedInterview) {
      return res.status(404).json({ message: 'Interview not found or unauthorized' });
    }
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting interview' });
  }
});

// =============================

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});