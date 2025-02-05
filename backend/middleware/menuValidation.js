const validateMenuItem = (req, res, next) => {
  const { name, price, category } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  if (!category || category.trim() === '') {
    return res.status(400).json({ error: 'Category is required' });
  }

  // Clean the data
  req.body.name = name.trim();
  req.body.description = req.body.description || '';
  req.body.price = Number(price);
  req.body.category = category.trim();
  req.body.imageUrl = req.body.imageUrl || '';

  next();
};

module.exports = {
  validateMenuItem
};