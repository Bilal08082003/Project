const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

const { updateAbout } = require('../controllers/aboutController');
const { createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { getAllReviews, approveReview, rejectReview, deleteReview } = require('../controllers/reviewController');
const { getContacts, markAsRead, updateStatus, deleteContact } = require('../controllers/contactController');
const { getAnalytics, getDashboard } = require('../controllers/visitorController');

// All admin routes require authentication
router.use(protect, adminOnly);

// Dashboard summary
router.get('/dashboard', getDashboard);

// Analytics
router.get('/analytics', getAnalytics);

// About management
router.put('/about', updateAbout);

// Project management
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Skill management
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Review management
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/reject', rejectReview);
router.delete('/reviews/:id', deleteReview);

// Contact/message management
router.get('/contacts', getContacts);
router.put('/contacts/:id/read', markAsRead);
router.put('/contacts/:id/status', updateStatus);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
