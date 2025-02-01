const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { initializeFirebase } = require('./config/firebase-config');
require('dotenv').config();

const app = express();

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes will be added here later

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});