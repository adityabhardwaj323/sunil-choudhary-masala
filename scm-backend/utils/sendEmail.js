const nodemailer = require('nodemailer');

// Create a reusable, pooled transporter
let transporter = null;
let isEmailAvailable = false;

const initTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    // Explicit timeouts
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000 // 15 seconds
  });

  return transporter;
};

// Startup verification
const verifyEmailConnection = async () => {
  try {
    const t = initTransporter();
    await t.verify();
    isEmailAvailable = true;
    console.log('✅ SMTP connection verified. Email system is available.');
  } catch (error) {
    isEmailAvailable = false;
    console.warn('⚠️ SMTP Connection Failed. Email functionality marked as unavailable.');
    console.warn(`Reason: ${error.message}`);
    // Do not log full error or credentials
  }
};

const sendEmail = async (options) => {
  const t = initTransporter();

  // If we know email is down, we could fail fast, but it's often better to try 
  // since the outage might be temporary. We'll still attempt delivery.
  
  // Define the email options
  const message = {
    from: `${process.env.EMAIL_FROM_NAME || 'Sunil Choudhary Masala'} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html // Optional HTML version
  };

  // Send the email
  const info = await t.sendMail(message);

  return info;
};

module.exports = {
  sendEmail,
  verifyEmailConnection
};

