const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token, access denied' });
  }

  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7, authHeader.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'swara_secret_key_2026_ethnic_wear');
    if (decoded.username !== 'admin123') {
      return res.status(403).json({ message: 'Access denied: invalid role' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
