const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define the email options
  const message = {
    from: `${process.env.EMAIL_FROM_NAME || 'Sunil Choudhary Masala'} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html // Optional HTML version
  };

  // Send the email
  const info = await transporter.sendMail(message);

  return info;
};

module.exports = sendEmail;
