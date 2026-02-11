const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userRoleSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    user_id: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserRole', userRoleSchema);
