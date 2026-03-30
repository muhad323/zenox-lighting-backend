const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabases() {
    const client = await mongoose.connect(process.env.MONGODB_URI);
    const admin = client.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases:', dbs.databases.map(db => db.name));
    process.exit(0);
}

checkDatabases();
