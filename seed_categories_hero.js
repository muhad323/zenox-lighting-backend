/**
 * seed_categories_hero.js
 * 
 * Seeds:
 *  1. All 5 main lighting categories + their subcategories
 *  2. Hero content slides (local /HeroVideos/ files)
 * 
 * Run: node seed_categories_hero.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Category = require('./models/Category');
const HeroContent = require('./models/HeroContent');

// ─────────────────────────────────────────────
// 1. CATEGORY DATA
// ─────────────────────────────────────────────
const CATEGORIES_TREE = [
    {
        name: 'Indoor Lighting',
        description: 'Premium interior lighting solutions for homes, hotels, offices, and commercial spaces.',
        display_order: 1,
        subcategories: [
            { name: 'Downlights', description: 'Recessed downlights for clean, modern ceiling aesthetics.' },
            { name: 'Spotlights', description: 'Directional spotlights for accent and task lighting.' },
            { name: 'Track Lights', description: 'Versatile track-mounted lighting systems for retail and galleries.' },
            { name: 'Magnetic Track Lights', description: 'Sleek magnetic track systems with modular accessories.' },
            { name: 'Linear Lighting Systems', description: 'Continuous linear LED profiles for architectural applications.' },
            { name: 'Panel Lights', description: 'Flat LED panels providing even, glare-free illumination.' },
            { name: 'Strip Lights and Neon Lights', description: 'Flexible LED strips and neon-effect lights for creative installations.' },
        ],
    },
    {
        name: 'Outdoor Lighting',
        description: 'Durable and weather-resistant lighting for facades, landscapes, and public areas.',
        display_order: 2,
        subcategories: [
            { name: 'Bollard Lights', description: 'Low-level bollard fixtures for pathways and driveways.' },
            { name: 'Inground Lights', description: 'Flush-mounted inground luminaires for walkways and plazas.' },
            { name: 'Step Lights', description: 'Compact step and stair lighting for safety and ambiance.' },
            { name: 'Spike Lights', description: 'Ground-spike spotlights perfect for landscape and garden uplighting.' },
            { name: 'Wall Lights', description: 'Exterior wall-mounted fixtures for facades and entrances.' },
            { name: 'Underwater Lights', description: 'IP68 submersible lights for pools, fountains, and water features.' },
        ],
    },
    {
        name: 'Industrial Lighting',
        description: 'Heavy-duty, high-performance lighting for warehouses, factories, and utilities.',
        display_order: 3,
        subcategories: [
            { name: 'Weatherproof Lights', description: 'IP65+ rated luminaires for harsh outdoor industrial environments.' },
            { name: 'High Bay Lights', description: 'High-lumen fixtures for warehouses and large-span ceilings.' },
            { name: 'Flood Lights', description: 'Wide-beam floodlights for area and perimeter security lighting.' },
            { name: 'Street Lights', description: 'Energy-efficient LED street and road lighting.' },
            { name: 'Bulkhead Lights', description: 'Rugged bulkhead fittings for stairwells and service areas.' },
            { name: 'Emergency Lights', description: 'Safety emergency and exit lighting with backup power.' },
        ],
    },
    {
        name: 'Decorative Lighting',
        description: 'Statement lighting pieces that blend artistry and functionality for elegant interiors.',
        display_order: 4,
        subcategories: [
            { name: 'Pendant Lights', description: 'Hanging pendant fixtures as focal points over tables and bars.' },
            { name: 'Chandeliers', description: 'Grand chandeliers for lobbies, dining rooms, and ballrooms.' },
            { name: 'Decorative Wall Lights', description: 'Ornamental wall sconces to enhance ambiance and character.' },
        ],
    },
    {
        name: 'Smart & Control Systems',
        description: 'Intelligent lighting control solutions for automation, energy savings, and smart buildings.',
        display_order: 5,
        subcategories: [
            { name: 'Smart Lighting Systems', description: 'Connected LED systems with app and voice control.' },
            { name: 'Lighting Control Systems', description: 'DALI, DMX, and KNX-based lighting management platforms.' },
            { name: 'Sensors & Automation', description: 'Motion, daylight, and occupancy sensors for automated control.' },
        ],
    },
];

// ─────────────────────────────────────────────
// 2. HERO CONTENT DATA
// ─────────────────────────────────────────────
const HERO_SLIDES = [
    {
        title: 'Illuminate Your World',
        subtitle: 'Architectural lighting solutions crafted to enhance every space with precision and elegance',
        media_type: 'video',
        media_url: '/HeroVideos/Hero-1.mp4',
        cta_text: 'Explore Products',
        cta_link: '/products',
        display_order: 1,
        is_active: true,
    },
    {
        title: 'Indoor Ambiance Redefined',
        subtitle: 'Premium indoor lighting collections for homes, hotels, and commercial interiors',
        media_type: 'video',
        media_url: '/HeroVideos/Hero-2.mp4',
        cta_text: 'Indoor Collection',
        cta_link: '/products',
        display_order: 2,
        is_active: true,
    },
    {
        title: 'Outdoor Brilliance',
        subtitle: 'Robust luminaire solutions designed to illuminate facades, landscapes, and public spaces',
        media_type: 'video',
        media_url: '/HeroVideos/Hero-3.mp4',
        cta_text: 'View Projects',
        cta_link: '/projects',
        display_order: 3,
        is_active: true,
    },
    {
        title: 'Architectural Precision',
        subtitle: 'Delivering bespoke lighting designs that blend functionality with design excellence',
        media_type: 'video',
        media_url: '/HeroVideos/Hero-4.mp4',
        cta_text: 'Our Services',
        cta_link: '/services',
        display_order: 4,
        is_active: true,
    },
    {
        title: 'Lighting for Every Vision',
        subtitle: 'From concept to installation — complete lighting solutions tailored to your project needs',
        media_type: 'video',
        media_url: '/HeroVideos/Hero-5.mp4',
        cta_text: 'Get In Touch',
        cta_link: '/contact',
        display_order: 5,
        is_active: true,
    },
];

// ─────────────────────────────────────────────
// HELPER: slugify
// ─────────────────────────────────────────────
function slugify(text) {
    return text.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/\s+/g, '-');
}

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────
async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── HERO CONTENT ──────────────────────────
    console.log('\n🎬 Seeding hero content...');
    for (const slide of HERO_SLIDES) {
        const exists = await HeroContent.findOne({ title: slide.title });
        if (exists) {
            console.log(`  ⏩ Hero slide already exists: "${slide.title}"`);
            continue;
        }
        await HeroContent.create({ id: uuidv4(), ...slide });
        console.log(`  ✅ Created hero slide: "${slide.title}"`);
    }

    // ── CATEGORIES ────────────────────────────
    console.log('\n📂 Seeding categories and subcategories...');
    for (const cat of CATEGORIES_TREE) {
        const parentSlug = slugify(cat.name);

        // Upsert parent
        let parent = await Category.findOne({ slug: parentSlug });
        if (!parent) {
            parent = await Category.create({
                id: uuidv4(),
                name: cat.name,
                slug: parentSlug,
                description: cat.description,
                display_order: cat.display_order,
                parent_id: null,
                is_active: true,
            });
            console.log(`  ✅ Created: ${cat.name}`);
        } else {
            console.log(`  ⏩ Already exists: ${cat.name}`);
        }

        // Upsert subcategories
        for (const sub of cat.subcategories) {
            const subSlug = slugify(sub.name);
            const existsSub = await Category.findOne({ slug: subSlug });
            if (!existsSub) {
                await Category.create({
                    id: uuidv4(),
                    name: sub.name,
                    slug: subSlug,
                    description: sub.description,
                    parent_id: parent.id,
                    is_active: true,
                });
                console.log(`      ✅ Subcategory: ${sub.name}`);
            } else {
                // Update parent_id in case it wasn't set
                if (!existsSub.parent_id) {
                    await Category.updateOne({ slug: subSlug }, { parent_id: parent.id });
                    console.log(`      🔧 Updated parent_id for: ${sub.name}`);
                } else {
                    console.log(`      ⏩ Already exists: ${sub.name}`);
                }
            }
        }
    }

    console.log('\n🎉 Seeding complete!');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
