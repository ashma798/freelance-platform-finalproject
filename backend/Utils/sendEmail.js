const nodemailer = require("nodemailer");

const sendEmail = async ({ fromName, fromEmail,to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
      },
      tls: {
        rejectUnauthorized: false // only for dev
      }
    });
    
    const mailOptions = {
      fromName,
      fromEmail,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = sendEmail;
