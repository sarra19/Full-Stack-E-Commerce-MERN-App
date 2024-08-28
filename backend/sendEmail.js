const nodemailer = require("nodemailer");

function sendEmail({ recipient_email, subject, text, html }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE || "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mail_configs = {
      from: process.env.USER,
      to: recipient_email,
      subject: subject,
      text: text,  // Plain text content
      html: html,  // HTML content
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return reject({ message: "An error has occurred" });
      }
      console.log("Email sent successfully");
      return resolve({ message: "Email sent successfully" });
    });
  });
}

module.exports = sendEmail;
