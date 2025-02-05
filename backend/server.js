const express = require('express');
const cors = require('cors');
const { admin } = require('./config/firebase-config');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firestore
const db = admin.firestore();

// Test Firebase route
app.get('/api/test-firebase', async (req, res) => {
  try {
    // Test only Firestore first
    await db.collection('test').doc('test').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: 'Firebase Firestore is working correctly!' });
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({ 
      error: 'Firebase configuration error',
      details: error.message 
    });
  }
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
  });
});