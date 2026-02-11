const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');
const Product = require('./models/Product');
const Service = require('./models/Service');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zenox_lighting';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Service.deleteMany({});

        // Add Categories
        const categories = await Category.insertMany([
            { name: 'Indoor Lighting', slug: 'indoor-lighting', description: 'Lighting for interior spaces', display_order: 1 },
            { name: 'Outdoor Lighting', slug: 'outdoor-lighting', description: 'Lighting for exterior spaces', display_order: 2 },
            { name: 'Industrial Lighting', slug: 'industrial-lighting', description: 'Heavy duty lighting', display_order: 3 }
        ]);

        console.log('Categories seeded');

        // Add Products
        await Product.insertMany([
            {
                name: 'Modern Chandelier',
                slug: 'modern-chandelier',
                description: 'A beautiful modern chandelier for your living room.',
                category_id: categories[0].id,
                images: ['https://images.unsplash.com/photo-1513506490263-91498b715702?q=80&w=2070&auto=format&fit=crop'],
                is_featured: true
            },
            {
                name: 'Outdoor Floodlight',
                slug: 'outdoor-floodlight',
                description: 'High power floodlight for your backyard.',
                category_id: categories[1].id,
                images: ['https://images.unsplash.com/photo-1565814636199-ae8133055c1c?q=80&w=2080&auto=format&fit=crop'],
                is_featured: true
            }
        ]);

        console.log('Products seeded');

        // Add Services
        await Service.insertMany([
            { title: 'Lighting Design', slug: 'lighting-design', description: 'Professional lighting design services.' },
            { title: 'Installation', slug: 'installation', description: 'Expert installation services.' }
        ]);

        console.log('Services seeded');
        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
