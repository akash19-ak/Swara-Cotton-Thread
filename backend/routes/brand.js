const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const storage = require('../services/storage');

// Get brand settings
router.get('/', async (req, res) => {
  try {
    const brand = await storage.getBrand();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update brand settings (Admin Only)
router.put('/', auth, async (req, res) => {
  try {
    const updatedBrand = await storage.updateBrand(req.body);
    res.json(updatedBrand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
