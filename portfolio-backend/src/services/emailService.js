const nodemailer = require('nodemailer');

const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send contact notification to admin
exports.sendContactNotification = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_USER,
    subject: `📩 New Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0f23; color: #e0e0ff; border-radius: 12px;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">New Portfolio Contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #a0a0c0; width: 100px;"><strong>Name:</strong></td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px; color: #a0a0c0;"><strong>Email:</strong></td><td style="padding: 8px;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td></tr>
          <tr><td style="padding: 8px; color: #a0a0c0;"><strong>Subject:</strong></td><td style="padding: 8px;">${subject}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #1a1a3e; border-radius: 8px; border-left: 3px solid #6366f1;">
          <strong style="color: #a0a0c0;">Message:</strong>
          <p style="margin-top: 8px; line-height: 1.6;">${message}</p>
        </div>
        <p style="margin-top: 20px; color: #606080; font-size: 12px;">Sent from Muhammad Bilal's Portfolio Contact Form</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send auto-reply to sender
exports.sendAutoReply = async ({ name, email }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Muhammad Bilal" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `✅ Message Received — Muhammad Bilal`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f0f23; color: #e0e0ff; border-radius: 12px;">
        <h2 style="color: #6366f1;">Thanks for reaching out, ${name}! 👋</h2>
        <p style="line-height: 1.7; color: #c0c0e0;">
          I've received your message and will get back to you as soon as possible — typically within 24 hours.
        </p>
        <p style="line-height: 1.7; color: #c0c0e0;">
          In the meantime, feel free to connect with me on WhatsApp for urgent inquiries:
        </p>
        <a href="https://wa.me/923018032287" style="display: inline-block; margin-top: 10px; padding: 12px 24px; background: #25D366; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          💬 Chat on WhatsApp
        </a>
        <p style="margin-top: 30px; color: #606080; font-size: 12px;">— Muhammad Bilal | BS Computer Science | AI & Full Stack Developer</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
