const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productInquirySchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    product_id: { type: String, ref: 'Product' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    message: { type: String },
    status: { type: String, default: 'new' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('ProductInquiry', productInquirySchema);
