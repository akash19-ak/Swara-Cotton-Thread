const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin123' && password === 'swara123') {
    const token = jwt.sign(
      { username: 'admin123' },
      process.env.JWT_SECRET || 'swara_secret_key_2026_ethnic_wear',
      { expiresIn: '7d' }
    );
    return res.json({ token, username });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
});

module.exports = router;
