const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

module.exports = router;