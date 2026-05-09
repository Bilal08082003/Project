const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  name: { type: String, default: 'Muhammad Bilal' },
  title: { type: String, default: 'Full Stack Developer & AI Engineer' },
  tagline: { type: String, default: 'Building intelligent systems with clean code' },
  bio: {
    type: String,
    default: 'A passionate Computer Science student in my 6th semester with a CGPA of 3.0, specializing in Artificial Intelligence, Machine Learning, and Full Stack Development. I build intelligent, scalable solutions that make a real-world impact.',
  },
  email: { type: String, default: 'bilalsuleman780@gmail.com' },
  whatsapp: { type: String, default: '+923018032287' },
  whatsappLink: { type: String, default: 'https://wa.me/923018032287' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  location: { type: String, default: 'Pakistan' },
  avatarUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  isAvailableForWork: { type: Boolean, default: true },
  education: [{
    degree: String,
    institution: String,
    year: String,
    score: String,
    description: String,
  }],
  stats: {
    projectsCompleted: { type: Number, default: 5 },
    technologiesLearned: { type: Number, default: 20 },
    currentSemester: { type: Number, default: 6 },
    cgpa: { type: Number, default: 3.0 },
  },
  updatedAt: { type: Date, default: Date.now },
});

AboutSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('About', AboutSchema);
