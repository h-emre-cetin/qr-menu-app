const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase-config');
const { validateCredentials } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Register new restaurant
router.post('/register', async (req, res) => {
  try {
    const { email, password, businessName } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({ error: 'Email, password, and business name are required' });
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: businessName
    });

    // Generate business ID from name
    const businessId = businessName.toLowerCase().replace(/\s+/g, '-');

    // Create business document
    const businessRef = admin.firestore().collection('businesses').doc(businessId);
    await businessRef.set({
      name: businessName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ownerId: userRecord.uid
    });

    // Create menu document
    const menuRef = admin.firestore().collection('menus').doc();
    await menuRef.set({
      businessId: businessId,
      items: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update business with menu reference
    await businessRef.update({
      menuId: menuRef.id
    });

    res.status(201).json({ 
      message: 'Business registered successfully',
      businessId: businessId,
      menuId: menuRef.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Get business info
    const businessSnapshot = await admin.firestore()
      .collection('businesses')
      .where('ownerId', '==', user.uid)
      .get();

    if (businessSnapshot.empty) {
      throw new Error('No business found for this user');
    }

    const businessData = businessSnapshot.docs[0].data();
    const businessId = businessSnapshot.docs[0].id;

    // Create a custom token that client will exchange for ID token
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.json({ 
      customToken: customToken, // Changed from token to customToken
      businessId: businessId,
      businessName: businessData.name,
      menuId: businessData.menuId,
      note: "Exchange this custom token for an ID token using Firebase client SDK"
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;