const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category_id: { type: String, ref: 'Category' },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('product_categories', {
    ref: 'Category',
    localField: 'category_id',
    foreignField: 'id',
    justOne: true
});

module.exports = mongoose.model('Product', productSchema);
