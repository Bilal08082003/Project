const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI missing from .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const Admin = require('../models/Admin');
    const About = require('../models/About');

    await Admin.deleteMany({});
    await About.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@2024!', salt);

    await Admin.create({
      name: 'Muhammad Bilal',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
    });

    await About.create({
      name: 'Muhammad Bilal',
      title: 'Full Stack Developer & AI Engineer',
      tagline: 'Building intelligent systems with clean code',
      bio: 'REST API engineer specializing in Node.js, Express, and MongoDB.',
      education: [],
      stats: { projectsCompleted: 0, technologiesLearned: 0, currentSemester: 0, cgpa: 0 },
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
