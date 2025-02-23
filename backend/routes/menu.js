const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase-config');
const { validateMenuItem } = require('../middleware/menuValidation');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');
const db = admin.firestore();

// Public routes - Get menu items by business
router.get('/business/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Get business info
    const businessDoc = await db.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Get menu items
    const menuDoc = await db.collection('menus').doc(businessDoc.data().menuId).get();
    const menuItems = menuDoc.exists ? menuDoc.data().items || [] : [];

    res.json({
      business: businessDoc.data(),
      menu: menuItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu items by category
router.get('/business/:businessId/category/:category', async (req, res) => {
  try {
    const { businessId, category } = req.params;
    
    // Get business info
    const businessDoc = await db.collection('businesses').doc(businessId).get();
    if (!businessDoc.exists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Get menu items and filter by category
    const menuDoc = await db.collection('menus').doc(businessDoc.data().menuId).get();
    const allItems = menuDoc.exists ? menuDoc.data().items || [] : [];
    const categoryItems = allItems.filter(item => item.category === category);

    res.json(categoryItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes - update middleware
router.post('/items', authenticateToken, validateMenuItem, async (req, res) => {
  try {
    const businessSnapshot = await db.collection('businesses')
      .where('ownerId', '==', req.user.uid)
      .get();

    if (businessSnapshot.empty) {
      return res.status(403).json({ error: 'No business found for this user' });
    }

    const businessData = businessSnapshot.docs[0].data();
    const menuRef = db.collection('menus').doc(businessData.menuId);
    
    const newItem = {
      id: admin.firestore.Timestamp.now().toMillis().toString(),
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add item to menu's items array
    await menuRef.update({
      items: admin.firestore.FieldValue.arrayUnion(newItem)
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
router.put('/items/:itemId', authenticateAdmin, validateMenuItem, async (req, res) => {
  try {
    const { itemId } = req.params;
    const businessSnapshot = await db.collection('businesses')
      .where('ownerId', '==', req.user.uid)
      .get();

    if (businessSnapshot.empty) {
      return res.status(403).json({ error: 'No business found for this user' });
    }

    const businessData = businessSnapshot.docs[0].data();
    const menuRef = db.collection('menus').doc(businessData.menuId);
    const menuDoc = await menuRef.get();
    
    if (!menuDoc.exists) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const items = menuDoc.data().items || [];
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      ...req.body,
      id: itemId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await menuRef.update({ items });
    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
router.delete('/items/:itemId', authenticateAdmin, async (req, res) => {
  try {
    const { itemId } = req.params;
    const businessSnapshot = await db.collection('businesses')
      .where('ownerId', '==', req.user.uid)
      .get();

    if (businessSnapshot.empty) {
      return res.status(403).json({ error: 'No business found for this user' });
    }

    const businessData = businessSnapshot.docs[0].data();
    const menuRef = db.collection('menus').doc(businessData.menuId);
    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const items = menuDoc.data().items || [];
    const itemToDelete = items.find(item => item.id === itemId);

    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await menuRef.update({
      items: admin.firestore.FieldValue.arrayRemove(itemToDelete)
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;