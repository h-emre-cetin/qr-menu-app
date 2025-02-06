const validateMenuItem = (req, res, next) => {
  const { name, price, category } = req.body;

  // Validate name
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (name.length > 100) {
    return res.status(400).json({ error: 'Name must be less than 100 characters' });
  }

  // Validate price
  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  // Validate category
  if (!category || category.trim() === '') {
    return res.status(400).json({ error: 'Category is required' });
  }
  if (category.length > 75) {
    return res.status(400).json({ error: 'Category must be less than 75 characters' });
  }

  // Validate description if provided
  if (req.body.description && req.body.description.length > 250) {
    return res.status(400).json({ error: 'Description must be less than 250 characters' });
  }

  // Clean the data
  req.body.name = name.trim();
  req.body.description = req.body.description ? req.body.description.trim() : '';
  req.body.price = Number(price);
  req.body.category = category.trim();
  req.body.imageUrl = req.body.imageUrl || '';

  next();
};

module.exports = {
  validateMenuItem
};