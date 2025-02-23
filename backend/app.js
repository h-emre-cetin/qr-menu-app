const express = require('express');
const cors = require('cors');
// Update the path to match the actual file name
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menu');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
// Remove or comment out test routes
// app.use('/api/test', testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;