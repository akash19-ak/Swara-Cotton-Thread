const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { getUploadDirectory, getUploadUrl } = require('../services/uploadStorage');

const uploadDir = getUploadDirectory();

// Configure Storage
const storageConfig = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)'));
};

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Single image upload endpoint (Admin Only)
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ url: getUploadUrl(req.file.filename) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Multiple images upload endpoint (Admin Only)
router.post('/multiple', auth, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const fileUrls = req.files.map(file => getUploadUrl(file.filename));
    res.json({ urls: fileUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
