const { admin } = require('../config/firebase-config');

// Token authentication
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticateToken(req, res, async () => {
      const businessSnapshot = await admin.firestore()
        .collection('businesses')
        .where('ownerId', '==', req.user.uid)
        .get();

      if (businessSnapshot.empty) {
        return res.status(403).json({ error: 'Not authorized as business owner' });
      }

      req.business = businessSnapshot.docs[0].data();
      req.business.id = businessSnapshot.docs[0].id;
      next();
    });
  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(403).json({ error: 'Not authorized' });
  }
};

module.exports = {
  authenticateToken,
  authenticateAdmin
};