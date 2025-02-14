const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase-config');
const { validateMenuItem } = require('../middleware/menuValidation');
const db = admin.firestore();

// Get all menu items
router.get('/items', async (req, res) => {
  try {
    const menuSnapshot = await db.collection('menuItems').get();
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
    const newItem = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('menuItems').add(newItem);
    const doc = await docRef.get();
    
    res.status(201).json({
      id: docRef.id,
      ...doc.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
router.put('/items/:id', validateMenuItem, async (req, res) => {
  try {
    const { id } = req.params;
    const menuRef = db.collection('menuItems').doc(id);
    
    const doc = await menuRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await menuRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuRef = db.collection('menuItems').doc(id);
    
    const doc = await menuRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await menuRef.delete();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;