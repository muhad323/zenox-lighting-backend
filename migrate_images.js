const https = require('https');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Product = require('./models/Product');

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function migrateImages() {
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await Product.find({});
    console.log(`Found ${products.length} products to check...`);

    const uploadsDir = path.join(__dirname, 'uploads', 'images');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const product of products) {
        let updated = false;
        const newImages = [];

        for (const imageUrl of product.images) {
            if (imageUrl.includes('zenox-lighting-backend-production.up.railway.app')) {
                const filename = imageUrl.split('/').pop();
                const localPath = path.join(uploadsDir, filename);
                const relativePath = `/uploads/images/${filename}`;

                try {
                    console.log(`Downloading ${filename} for ${product.name}...`);
                    await downloadFile(imageUrl, localPath);
                    newImages.push(relativePath);
                    updated = true;
                } catch (err) {
                    console.error(`Failed to download ${imageUrl}: ${err.message}`);
                    newImages.push(imageUrl); // Keep original if it fails
                }
            } else {
                newImages.push(imageUrl);
            }
        }

        if (updated) {
            product.images = newImages;
            await product.save();
            console.log(`Successfully migrated images for ${product.name}`);
        }
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrateImages();
