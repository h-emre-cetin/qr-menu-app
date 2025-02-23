const validateCredentials = (req, res, next) => {
  const { email, password } = req.body;
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password validation
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one number' });
  }

  next();
};

module.exports = { validateCredentials };