const mongoose = require('mongoose');
require('dotenv').config();

async function checkCollections() {
    await mongoose.connect(process.env.MONGODB_URI);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    for (const coll of collections) {
        const count = await mongoose.connection.db.collection(coll.name).countDocuments();
        console.log(`Collection: ${coll.name}, Count: ${count}`);
    }
    process.exit(0);
}

checkCollections();
