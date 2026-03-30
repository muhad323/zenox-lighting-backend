const mongoose = require('mongoose');
require('dotenv').config();

async function testConn() {
    console.log('Connecting to:', process.env.MONGODB_URI.substring(0, 30) + '...');
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connection successful!');
    } catch (err) {
        console.error('Connection failed:', err.message);
    }
    process.exit(0);
}

testConn();
