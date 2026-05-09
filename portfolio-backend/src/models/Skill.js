const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['AI/ML', 'Frontend', 'Backend', 'Languages', 'Database', 'Mobile', 'Networking', 'Other'],
    required: true,
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 80,
  },
  icon: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Skill', SkillSchema);
