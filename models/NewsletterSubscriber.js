const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const newsletterSubscriberSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    subscribed_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
