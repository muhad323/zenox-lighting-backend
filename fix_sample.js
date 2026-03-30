const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function fixSample() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Update ZXS 3105 to use a local image that we know exists
    const res = await Product.findOneAndUpdate(
        { name: 'ZXS 3105' },
        { 
            images: ['/uploads/images/1bfddd0a-1364-4dae-81df-2b23a2360ee5.jpg']
        },
        { new: true }
    );
    
    if (res) {
        console.log('Successfully updated ZXS 3105 with local image');
    } else {
        console.log('Product ZXS 3105 not found');
    }
    process.exit(0);
}

fixSample();
