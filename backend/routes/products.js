const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const storage = require('../services/storage');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await storage.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product (Admin Only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, images, inStock, isTrending, sizes } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }
    const product = await storage.createProduct({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      category,
      images: images || [],
      inStock: inStock !== undefined ? inStock : true,
      isTrending: isTrending !== undefined ? isTrending : false,
      sizes: sizes || []
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product (Admin Only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, images, inStock, isTrending, sizes } = req.body;
    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name;
    if (price !== undefined) updatedFields.price = Number(price);
    if (originalPrice !== undefined) updatedFields.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (description !== undefined) updatedFields.description = description;
    if (category !== undefined) updatedFields.category = category;
    if (images !== undefined) updatedFields.images = images;
    if (inStock !== undefined) updatedFields.inStock = inStock;
    if (isTrending !== undefined) updatedFields.isTrending = isTrending;
    if (sizes !== undefined) updatedFields.sizes = sizes;

    const product = await storage.updateProduct(req.params.id, updatedFields);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await storage.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
