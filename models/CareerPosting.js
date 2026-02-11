const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const careerPostingSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    department: { type: String },
    location: { type: String },
    employment_type: { type: String },
    description: { type: String },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('CareerPosting', careerPostingSchema);
