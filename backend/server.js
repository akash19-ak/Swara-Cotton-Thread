require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./services/database');
const { initStorage } = require('./services/storage');
const { getUploadDirectory, resolveUploadPublicBaseUrl } = require('./services/uploadStorage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded media
const uploadDir = getUploadDirectory();
const uploadBaseUrl = resolveUploadPublicBaseUrl();
app.use(uploadBaseUrl, express.static(uploadDir));

// API Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/upload', require('./routes/upload'));

// Basic Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: require('./services/database').isMongoDB() ? 'MongoDB' : 'Local JSON' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

async function startServer() {
  await connectDB();
  await initStorage();

  app.listen(PORT, () => {
    console.log(`Swara Cotton Thread backend server listening on port ${PORT}`);
  });
}

startServer();
