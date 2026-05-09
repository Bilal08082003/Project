const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
  },
  ipAddress: {
    type: String,
    select: false,
  },
  userAgent: {
    type: String,
  },
  country: {
    type: String,
    default: 'Unknown',
  },
  city: {
    type: String,
    default: 'Unknown',
  },
  referrer: {
    type: String,
    default: 'Direct',
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    default: 'unknown',
  },
  pagesVisited: [{
    page: String,
    visitedAt: { type: Date, default: Date.now },
  }],
  visitCount: {
    type: Number,
    default: 1,
  },
  firstVisit: {
    type: Date,
    default: Date.now,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
});

// Analytics aggregate model
const AnalyticsSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    unique: true,
  },
  totalVisitors: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  pageViews: { type: Number, default: 0 },
  contactSubmissions: { type: Number, default: 0 },
  reviewSubmissions: { type: Number, default: 0 },
});

const Visitor = mongoose.model('Visitor', VisitorSchema);
const Analytics = mongoose.model('Analytics', AnalyticsSchema);

module.exports = { Visitor, Analytics };
