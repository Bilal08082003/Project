const { v4: uuidv4 } = require('uuid');
const { Visitor, Analytics } = require('../models/Visitor');

// Parse device type from user agent
const getDeviceType = (ua = '') => {
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/windows|mac|linux/i.test(ua)) return 'desktop';
  return 'unknown';
};

const getBrowser = (ua = '') => {
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/edg/i.test(ua)) return 'Edge';
  if (/opera|opr/i.test(ua)) return 'Opera';
  return 'Unknown';
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const trackVisitor = async (req, res, next) => {
  try {
    // Get or generate visitorId from cookie
    let visitorId = req.cookies?.visitorId;
    if (!visitorId) {
      visitorId = uuidv4();
      res.cookie('visitorId', visitorId, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        sameSite: 'lax',
      });
    }

    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const referrer = req.headers.referer || req.headers.referrer || 'Direct';
    const page = req.path;
    const today = getTodayDate();

    // Upsert visitor
    const existingVisitor = await Visitor.findOne({ visitorId });

    if (existingVisitor) {
      existingVisitor.visitCount += 1;
      existingVisitor.lastVisit = new Date();
      existingVisitor.pagesVisited.push({ page });
      if (existingVisitor.pagesVisited.length > 50) {
        existingVisitor.pagesVisited = existingVisitor.pagesVisited.slice(-50);
      }
      await existingVisitor.save();
    } else {
      await Visitor.create({
        visitorId,
        ipAddress: ip,
        userAgent,
        referrer,
        device: getDeviceType(userAgent),
        browser: getBrowser(userAgent),
        pagesVisited: [{ page }],
      });
    }

    // Update daily analytics
    await Analytics.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          totalVisitors: 1,
          uniqueVisitors: existingVisitor ? 0 : 1,
          pageViews: 1,
        },
      },
      { upsert: true, new: true }
    );

  } catch (err) {
    // Never crash the app due to tracking failure
    console.error('Visitor tracking error:', err.message);
  }

  next();
};

module.exports = trackVisitor;
