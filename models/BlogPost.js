const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const blogPostSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String },
    excerpt: { type: String },
    featured_image: { type: String },
    category: { type: String },
    tags: { type: [String], default: [] },
    author_id: { type: String },
    is_published: { type: Boolean, default: false },
    published_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
