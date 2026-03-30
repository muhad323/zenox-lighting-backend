const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');

async function checkCats() {
    await mongoose.connect(process.env.MONGODB_URI);
    const cats = await Category.find({ parent_id: null });
    console.log(JSON.stringify(cats.map(c => ({ name: c.name, slug: c.slug, id: c.id, display_order: c.display_order })), null, 2));
    process.exit(0);
}

checkCats();
