const { Visitor, Analytics } = require('../models/Visitor');
const Contact = require('../models/Contact');
const Review = require('../models/Review');

// @desc    Get visitor stats (public)
// @route   GET /api/visitors/count
// @access  Public
exports.getVisitorCount = async (req, res, next) => {
  try {
    const totalUnique = await Visitor.countDocuments();
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await Analytics.findOne({ date: today });

    res.status(200).json({
      success: true,
      data: {
        totalUniqueVisitors: totalUnique,
        todayVisitors: todayStats?.uniqueVisitors || 0,
        todayPageViews: todayStats?.pageViews || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full analytics (admin)
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10);
    const range = Number.isNaN(days) || days <= 0 ? 30 : days;
    const since = new Date();
    since.setDate(since.getDate() - range);

    const analytics = await Analytics.find({
      date: { $gte: since.toISOString().split('T')[0] },
    }).sort({ date: 1 });

    const totalVisitors = await Visitor.countDocuments();
    const deviceBreakdown = await Visitor.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]);

    const browserBreakdown = await Visitor.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
    ]);

    const totals = analytics.reduce(
      (acc, day) => {
        acc.pageViews += day.pageViews;
        acc.contactSubmissions += day.contactSubmissions;
        acc.reviewSubmissions += day.reviewSubmissions;
        return acc;
      },
      { pageViews: 0, contactSubmissions: 0, reviewSubmissions: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        totalUniqueVisitors: totalVisitors,
        last30Days: analytics,
        deviceBreakdown,
        browserBreakdown,
        totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin dashboard summary
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalVisitors,
      totalContacts,
      pendingReviews,
      approvedReviews,
      todayStats,
    ] = await Promise.all([
      Visitor.countDocuments(),
      Contact.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Analytics.findOne({ date: new Date().toISOString().split('T')[0] }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        visitors: {
          total: totalVisitors,
          todayPageViews: todayStats?.pageViews || 0,
        },
        contacts: { total: totalContacts },
        reviews: { pending: pendingReviews, approved: approvedReviews },
      },
    });
  } catch (error) {
    next(error);
  }
};
