const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function checkProducts() {
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    products.forEach(p => {
        console.log(`Product: ${p.name}, Images: ${JSON.stringify(p.images)}`);
    });
    process.exit(0);
}

checkProducts();
