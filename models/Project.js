const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const projectSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: String },
    client_name: { type: String },
    location: { type: String },
    industry: { type: String },
    category: { type: String },
    images: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    completed_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Project', projectSchema);
