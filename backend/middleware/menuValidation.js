const validateMenuItem = (req, res, next) => {
  const { name, portions, price, category } = req.body;

  // Validate name
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (name.length > 100) {
    return res.status(400).json({ error: 'Name must be less than 100 characters' });
  }

  // Price is always required
  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  // Validate portions only if provided
  if (portions) {
    if (!Array.isArray(portions)) {
      return res.status(400).json({ error: 'Portions must be an array' });
    }
    if (portions.length > 0) {
      for (const portion of portions) {
        if (!portion.size || portion.size.trim() === '') {
          return res.status(400).json({ error: 'Portion size is required' });
        }
        if (!portion.price || isNaN(portion.price) || portion.price <= 0) {
          return res.status(400).json({ error: 'Valid price is required for each portion' });
        }
      }
    }
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
  req.body.category = category.trim();
  req.body.imageUrl = req.body.imageUrl || '';
  req.body.price = Number(price);
  
  // Add portions only if provided
  if (portions && portions.length > 0) {
    req.body.portions = portions.map(p => ({
      size: p.size.trim(),
      price: Number(p.price)
    }));
  }

  next();
};

module.exports = {
  validateMenuItem
};