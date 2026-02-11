const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const careerApplicationSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    posting_id: { type: String, ref: 'CareerPosting' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resume_url: { type: String },
    cover_letter: { type: String },
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
