const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const testimonialSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    client_name: { type: String, required: true },
    client_title: { type: String },
    client_company: { type: String },
    client_image: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
