const About = require('../models/About');

// @desc    Get about/profile data
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();

    if (!about) {
      // Create default about from seed data
      about = await About.create({
        name: 'Muhammad Bilal',
        title: 'Full Stack Developer & AI Engineer',
        tagline: 'Building intelligent systems with clean code',
        bio: 'A passionate Computer Science student in my 6th semester with a CGPA of 3.0, specializing in Artificial Intelligence, Machine Learning, and Full Stack Development.',
        email: 'bilalsuleman780@gmail.com',
        whatsapp: '+923018032287',
        whatsappLink: 'https://wa.me/923018032287',
        location: 'Pakistan',
        isAvailableForWork: true,
        education: [
          {
            degree: 'BS Computer Science',
            institution: 'University',
            year: '2022 - Present',
            score: 'CGPA: 3.0',
            description: 'Currently in 6th Semester',
          },
          {
            degree: 'FSC Pre-Medical',
            institution: 'College',
            year: '2020 - 2022',
            score: '775 Marks',
            description: 'Pre-Medical Sciences',
          },
          {
            degree: 'Matriculation',
            institution: 'School',
            year: '2018 - 2020',
            score: '912 Marks',
            description: 'Secondary School Certificate',
          },
        ],
        stats: {
          projectsCompleted: 5,
          technologiesLearned: 20,
          currentSemester: 6,
          cgpa: 3.0,
        },
      });
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
};

// @desc    Update about/profile data
// @route   PUT /api/admin/about
// @access  Private/Admin
exports.updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: about });
  } catch (error) {
    next(error);
  }
};
