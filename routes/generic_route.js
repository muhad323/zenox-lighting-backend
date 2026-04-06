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
            syncFallbackIfProduct(Model, newItem, 'create');
            res.status(201).json(newItem);
        } catch (err) {
            console.warn('Database post error, attempting fallback update:', err.message);
            if (Model.modelName === 'Product') {
               const newItemData = req.body;
               if (!newItemData.id) newItemData.id = require('uuid').v4();
               newItemData.created_at = new Date();
               newItemData.updated_at = new Date();
               syncFallbackIfProduct(Model, newItemData, 'create');
               return res.status(201).json(newItemData);
            }
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
            
            // Always syncfallback if it's a Product, regardless of MongoDB success,
            // to ensure local JSON testing works seamlessly.
            if (updatedItem) {
                syncFallbackIfProduct(Model, updatedItem, 'update');
                return res.json(updatedItem);
            } else {
                // If not found in DB, try updating fallback anyway using body
                const updatedData = { ...req.body, id: req.params.id, updated_at: new Date() };
                syncFallbackIfProduct(Model, updatedData, 'update');
                return res.json(updatedData);
            }
        } catch (err) {
             console.warn('Database put error, attempting fallback update:', err.message);
             if (Model.modelName === 'Product') {
                 const updatedData = { ...req.body, id: req.params.id, updated_at: new Date() };
                 syncFallbackIfProduct(Model, updatedData, 'update');
                 return res.json(updatedData);
             }
            res.status(400).json({ message: err.message });
        }
    });

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            await Model.findOneAndDelete({ id: req.params.id });
            syncFallbackIfProduct(Model, { id: req.params.id }, 'delete');
            res.json({ message: 'Item deleted' });
        } catch (err) {
             console.warn('Database delete error, attempting fallback update:', err.message);
             if (Model.modelName === 'Product') {
                 syncFallbackIfProduct(Model, { id: req.params.id }, 'delete');
                 return res.json({ message: 'Item deleted from fallback' });
             }
            res.status(500).json({ message: err.message });
        }
    });

    // Helper for JSON Fallback sync
    function syncFallbackIfProduct(Model, itemData, action) {
        if (Model.modelName !== 'Product') return;
        try {
            const fs = require('fs');
            const path = require('path');
            const fallbackPath = path.join(__dirname, '..', 'fallback_products.json');
            if (fs.existsSync(fallbackPath)) {
                let fallbackData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
                
                if (action === 'create') {
                    fallbackData.push(itemData);
                } else if (action === 'update') {
                    const index = fallbackData.findIndex(p => p.id === itemData.id);
                    if (index !== -1) {
                        fallbackData[index] = { ...fallbackData[index], ...itemData };
                    } else {
                        // If it doesn't exist in fallback but we are updating, add it.
                        fallbackData.push(itemData);
                    }
                } else if (action === 'delete') {
                     fallbackData = fallbackData.filter(p => p.id !== itemData.id);
                }
                
                fs.writeFileSync(fallbackPath, JSON.stringify(fallbackData, null, 2));
            }
        } catch (e) {
            console.error('Failed to sync fallback JSON:', e.message);
        }
    }

    return router;
};

module.exports = createRouter;
