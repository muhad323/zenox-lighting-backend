const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const createRouter = require('./routes/generic_route');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Models
const Product = require('./models/Product');
const Category = require('./models/Category');
const BlogPost = require('./models/BlogPost');
const Project = require('./models/Project');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');
const ContactMessage = require('./models/ContactMessage');
const CareerPosting = require('./models/CareerPosting');
const CareerApplication = require('./models/CareerApplication');
const HeroContent = require('./models/HeroContent');
const NewsletterSubscriber = require('./models/NewsletterSubscriber');
const ProductInquiry = require('./models/ProductInquiry');
const CompanySetting = require('./models/CompanySetting');
const Profile = require('./models/Profile');
const UserRole = require('./models/UserRole');

// Register Routes
app.use('/api/products', createRouter(Product, ['product_categories']));
app.use('/api/product_categories', createRouter(Category)); // Map to Supabase table names
app.use('/api/blog_posts', createRouter(BlogPost));
app.use('/api/projects', createRouter(Project));
app.use('/api/services', createRouter(Service));
app.use('/api/testimonials', createRouter(Testimonial));
app.use('/api/contact_messages', createRouter(ContactMessage));
app.use('/api/career_postings', createRouter(CareerPosting));
app.use('/api/career_applications', createRouter(CareerApplication));
app.use('/api/hero_content', createRouter(HeroContent));
app.use('/api/newsletter_subscribers', createRouter(NewsletterSubscriber));
app.use('/api/product_inquiries', createRouter(ProductInquiry));
app.use('/api/company_settings', createRouter(CompanySetting));
app.use('/api/profiles', createRouter(Profile));
app.use('/api/user_roles', createRouter(UserRole));

// File Upload Route
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => {
    res.send('Zenox Lighting Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
