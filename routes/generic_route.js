const express = require('express');

const createRouter = (Model, populateOptions = []) => {
    const router = express.Router();

    // Get all
    router.get('/', async (req, res) => {
        try {
            let sort = req.query.sort || '-created_at';
            let query = Model.find().sort(sort);

            const filters = { ...req.query };
            delete filters.sort;
            delete filters.limit;

            if (Object.keys(filters).length > 0) {
                Object.keys(filters).forEach(key => {
                    if (filters[key] === 'true') filters[key] = true;
                    if (filters[key] === 'false') filters[key] = false;
                });
                query = query.where(filters);
            }

            if (req.query.limit) {
                query = query.limit(parseInt(req.query.limit));
            }

            if (populateOptions.length > 0) {
                populateOptions.forEach(opt => query.populate(opt));
            }

            const items = await query.exec();
            res.json(items);
        } catch (err) {
            console.error('Database error, attempting fallback:', err.message);
            // Fallback for Products
            if (Model.modelName === 'Product') {
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const fallbackPath = path.join(__dirname, '..', 'fallback_products.json');
                    if (fs.existsSync(fallbackPath)) {
                        const fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
                        return res.json(fallbackData);
                    }
                } catch (fallbackErr) {
                    console.error('Fallback failed:', fallbackErr.message);
                }
            }
            res.status(500).json({ message: err.message });
        }
    });

    // Get one by ID or Slug
    router.get('/:idOrSlug', async (req, res) => {
        try {
            let query = Model.findOne({
                $or: [{ id: req.params.idOrSlug }, { slug: req.params.idOrSlug }]
            });

            if (populateOptions.length > 0) {
                populateOptions.forEach(opt => query.populate(opt));
            }

            const item = await query.exec();
            if (!item) return res.status(404).json({ message: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Create
    router.post('/', async (req, res) => {
        const item = new Model(req.body);
        try {
            const newItem = await item.save();
            res.status(201).json(newItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Update
    router.put('/:id', async (req, res) => {
        try {
            const updatedItem = await Model.findOneAndUpdate(
                { id: req.params.id },
                req.body,
                { new: true }
            );
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            await Model.findOneAndDelete({ id: req.params.id });
            res.json({ message: 'Item deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};

module.exports = createRouter;
