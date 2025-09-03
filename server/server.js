const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const notesRoutes = require('./routes/notesRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes only (no frontend/static serving)
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notes', notesRoutes);

// NO CODE HERE THAT SERVES CLIENT/BUILD OR INDEX.HTML

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pocket-notes')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  const status = error.statusCode || 500;
  const message = error.message || 'Something went wrong!';
  res.status(status).json({ 
    message: message,
    success: false 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
