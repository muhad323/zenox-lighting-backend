const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const companySettingSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('CompanySetting', companySettingSchema);
