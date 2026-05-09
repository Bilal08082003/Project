const Review = require('../models/Review');
const { Analytics } = require('../models/Visitor');

const getTodayDate = () => new Date().toISOString().split('T')[0];

// @desc    Get approved reviews (public)
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved', isVisible: true })
      .select('-email -ipAddress')
      .sort({ approvedAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: parseFloat(avgRating),
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Public
exports.submitReview = async (req, res, next) => {
  try {
    const { name, email, company, role, rating, message } = req.body;

    // Check for duplicate email (one review per email)
    const existing = await Review.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A review with this email already exists.',
      });
    }

    const review = await Review.create({
      name,
      email,
      company,
      role,
      rating,
      message,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    // Track analytics
    await Analytics.findOneAndUpdate(
      { date: getTodayDate() },
      { $inc: { reviewSubmissions: 1 } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be visible after admin approval.',
      data: { id: review._id, name: review.name, rating: review.rating },
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN ROUTES ───────────────────────────────────────────────

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve review
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private/Admin
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isVisible: true, approvedAt: new Date() },
      { new: true }
    );

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, message: 'Review approved', data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject review
// @route   PUT /api/admin/reviews/:id/reject
// @access  Private/Admin
exports.rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', isVisible: false },
      { new: true }
    );

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, message: 'Review rejected', data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
