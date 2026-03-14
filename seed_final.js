/**
 * seed_final.js
 * 
 * Sets up a clean state with:
 *  1. Exactly the 5 main category groups and their requested subcategories.
 *  2. A collection of premium dummy testimonials for Zenox Lighting.
 *  3. Initial hero content and services.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Category = require('./models/Category');
const Testimonial = require('./models/Testimonial');
const HeroContent = require('./models/HeroContent');
const Service = require('./models/Service');

// ─────────────────────────────────────────────
// 1. CATEGORY DATA (EXACTLY AS REQUESTED)
// ─────────────────────────────────────────────
const CATEGORIES_TREE = [
    {
        name: 'Indoor Lighting',
        display_order: 1,
        subcategories: [
            'Downlights',
            'Spotlights',
            'Track Lights',
            'Magnetic Track Lights',
            'Linear Lighting Systems',
            'Panel Lights',
            'Strip lights and Neon Lights'
        ],
    },
    {
        name: 'Outdoor Lighting',
        display_order: 2,
        subcategories: [
            'Bollard Lights',
            'Inground Lights',
            'Step Lights',
            'Spike Lights',
            'Wall Lights',
            'Underwater Lights'
        ],
    },
    {
        name: 'Industrial Lighting',
        display_order: 3,
        subcategories: [
            'Weatherproof Lights',
            'High Bay Lights',
            'Flood Lights',
            'Street Lights',
            'Bulkhead Lights',
            'Emergency Lights'
        ],
    },
    {
        name: 'Decorative Lighting',
        display_order: 4,
        subcategories: [
            'Pendant Lights',
            'Chandeliers',
            'Decorative Wall Lights'
        ],
    },
    {
        name: 'Smart & Control Systems',
        display_order: 5,
        subcategories: [
            'Smart Lighting Systems',
            'Lighting Control Systems',
            'Sensors & Automation'
        ],
    },
];

// ─────────────────────────────────────────────
// 2. TESTIMONIALS DATA
// ─────────────────────────────────────────────
const TESTIMONIALS = [
    {
        client_name: "Mohammed Al Habtoor",
        client_title: "Project Director",
        client_company: "Nova Retail Spaces",
        content: "Zenox Lighting transformed our retail space completely. Their team brought precision, creativity, and professionalism to every stage of the project.",
        rating: 5,
        is_featured: true
    },
    {
        client_name: "Tariq Saeed",
        client_title: "Chief Architect",
        client_company: "Crescent Developments",
        content: "The team's expertise in architectural lighting is unmatched. They delivered exactly what we envisioned and beyond — on time and within budget.",
        rating: 5,
        is_featured: true
    },
    {
        client_name: "Ahmed Al Mansouri",
        client_title: "General Manager",
        client_company: "Emirates Heritage Builders",
        content: "We chose Zenox for their high-quality heritage lighting solutions. The results have been exceptional, perfectly blending modern technology with traditional aesthetics.",
        rating: 5,
        is_featured: true
    },
    {
        client_name: "Sarah Jenkins",
        client_title: "Senior Interior Designer",
        client_company: "Urban Edge Studios",
        content: "The decorative lighting collection from Zenox is outstanding. Their pieces are not just lights; they are architectural statements that define the atmosphere of our projects.",
        rating: 5,
        is_active: true
    },
    {
        client_name: "David Chen",
        client_title: "Operations Head",
        client_company: "Global Logistics Hub",
        content: "Zenox industrial lighting solutions significantly improved our warehouse safety and energy efficiency. Their technical support throughout the installation was flawless.",
        rating: 5,
        is_active: true
    }
];

// ─────────────────────────────────────────────
// 3. OTHER SEED DATA (HERO, SERVICES)
// ─────────────────────────────────────────────
const HERO_SLIDES = [
    {
        title: 'Light Up Your Vision',
        subtitle: 'Precision engineered architectural lighting solutions for commercial and residential masterpieces.',
        media_type: 'video',
        media_url: '/HeroVideos/Hero-1.mp4',
        cta_text: 'View Catalog',
        cta_link: '/products',
        display_order: 1,
    }
];

const SERVICES = [
    { title: 'Lighting Design', slug: 'lighting-design', description: 'Bespoke lighting design and photometric analysis for any architectural project.' },
    { title: 'Smart Integration', slug: 'smart-integration', description: 'Advanced lighting control and automation systems for energy efficiency and comfort.' }
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
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // CLEAR OLD DATA
        console.log('\n🧹 Clearing existing data...');
        await Category.deleteMany({});
        await Testimonial.deleteMany({});
        await HeroContent.deleteMany({});
        await Service.deleteMany({});
        console.log('  Done.');

        // ── HERO ──────────────────────────────
        console.log('\n🎬 Seeding hero content...');
        for (const slide of HERO_SLIDES) {
            await HeroContent.create({ id: uuidv4(), ...slide });
        }
        console.log('  Done.');

        // ── SERVICES ──────────────────────────
        console.log('\n🛠️ Seeding services...');
        for (const s of SERVICES) {
            await Service.create({ id: uuidv4(), ...s });
        }
        console.log('  Done.');

        // ── TESTIMONIALS ──────────────────────
        console.log('\n⭐ Seeding testimonials...');
        for (const t of TESTIMONIALS) {
            await Testimonial.create({ id: uuidv4(), ...t });
        }
        console.log('  Done.');

        // ── CATEGORIES ────────────────────────
        console.log('\n📂 Seeding categories...');
        for (const cat of CATEGORIES_TREE) {
            const parentId = uuidv4();
            await Category.create({
                id: parentId,
                name: cat.name,
                slug: slugify(cat.name),
                display_order: cat.display_order,
                parent_id: null,
                is_active: true,
            });
            console.log(`  ✅ ${cat.name}`);

            for (const sub of cat.subcategories) {
                await Category.create({
                    id: uuidv4(),
                    name: sub,
                    slug: slugify(sub),
                    parent_id: parentId,
                    is_active: true,
                });
                console.log(`      ↳ ${sub}`);
            }
        }

        console.log('\n🎉 ALL SYSTEMS SEEDED SUCCESSFULLY!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        console.error('❌ GLOBAL SEED FAILURE:', err);
        process.exit(1);
    }
}

seed();
