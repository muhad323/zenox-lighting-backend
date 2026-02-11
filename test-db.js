const mongoose = require('mongoose');
require('dotenv').config();

console.log('Attempting to connect to:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
