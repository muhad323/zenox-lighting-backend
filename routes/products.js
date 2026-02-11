const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products with category population
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ created_at: -1 });
        // Manually attach category as 'product_categories' to match Supabase join syntax
        const productsWithCategory = await Promise.all(products.map(async (p) => {
            const product = p.toObject();
            if (product.category_id) {
                const category = await Category.findOne({ id: product.category_id });
                product.product_categories = category;
            } else {
                product.product_categories = null;
            }
            return product;
        }));
        res.json(productsWithCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
    try {
        let product = await Product.findOne({
            $or: [{ id: req.params.idOrSlug }, { slug: req.params.idOrSlug }]
        });

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const productObj = product.toObject();
        if (productObj.category_id) {
            productObj.product_categories = await Category.findOne({ id: productObj.category_id });
        } else {
            productObj.product_categories = null;
        }

        res.json(productObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create product
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
