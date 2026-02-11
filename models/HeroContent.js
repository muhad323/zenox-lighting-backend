const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const heroContentSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    media_url: { type: String, required: true },
    media_type: { type: String, default: 'image' },
    cta_text: { type: String },
    cta_link: { type: String },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('HeroContent', heroContentSchema);
