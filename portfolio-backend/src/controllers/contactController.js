const Contact = require('../models/Contact');
const { Analytics } = require('../models/Visitor');
const emailService = require('../services/emailService');

const getTodayDate = () => new Date().toISOString().split('T')[0];

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    // Track analytics
    await Analytics.findOneAndUpdate(
      { date: getTodayDate() },
      { $inc: { contactSubmissions: 1 } },
      { upsert: true }
    );

    // Send emails (non-blocking — don't fail if email fails)
    try {
      await emailService.sendContactNotification({ name, email, subject, message });
      await emailService.sendAutoReply({ name, email });
    } catch (emailErr) {
      console.warn('⚠️  Email sending failed (non-critical):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: { id: contact._id },
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN ROUTES ───────────────────────────────────────────────

// @desc    Get all contact messages
// @route   GET /api/admin/contacts
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact as read
// @route   PUT /api/admin/contacts/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Marked as read', data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['unread', 'read', 'replied', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });

    res.status(200).json({ success: true, message: 'Status updated', data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
