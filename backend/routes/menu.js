const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase-config');
const { validateMenuItem } = require('../middleware/menuValidation');
const db = admin.firestore();

// Get all menu items
router.get('/items', async (req, res) => {
  try {
    const menuSnapshot = await db.collection('menuItems').orderBy('order').get();
    const menuItems = [];
    menuSnapshot.forEach(doc => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu items by category
router.get('/items/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const menuSnapshot = await db.collection('menuItems')
      .where('category', '==', category)
      .orderBy('order')
      .get();
    
    const menuItems = [];
    menuSnapshot.forEach(doc => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new menu item
router.post('/items', validateMenuItem, async (req, res) => {
  try {
    const docRef = await db.collection('menuItems').add({
      ...req.body,
      order: Date.now(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;