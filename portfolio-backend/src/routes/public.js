const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const { getAbout } = require('../controllers/aboutController');
const { getProjects, getProject } = require('../controllers/projectController');
const { getSkills } = require('../controllers/skillController');
const { getReviews, submitReview } = require('../controllers/reviewController');
const { submitContact } = require('../controllers/contactController');
const { getVisitorCount } = require('../controllers/visitorController');

// About
router.get('/about', getAbout);

// Projects
router.get('/projects', getProjects);
router.get('/projects/:id', getProject);

// Skills
router.get('/skills', getSkills);

// Reviews — read approved
router.get('/reviews', getReviews);

// Review submit with validation
router.post(
  '/reviews',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }),
  ],
  validate,
  submitReview
);

// Contact submit with validation
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  ],
  validate,
  submitContact
);

// Visitor count
router.get('/visitors/count', getVisitorCount);

module.exports = router;
