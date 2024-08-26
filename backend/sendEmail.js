const nodemailer = require("nodemailer");

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mail_configs = {
      from: process.env.USER,
      to: recipient_email,
      subject: "KODING 101 PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Koding 101 Password Recovery</title>
</head>
<body>
  <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
    <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
      <div style="border-bottom: 1px solid #eee;">
        <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">Koding 101</a>
      </div>
      <p style="font-size: 1.1em;">Hi,</p>
      <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes.</p>
      <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${OTP}</h2>
      <p style="font-size: 0.9em;">Regards,<br />Koding 101</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
        <p>Koding 101 Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return reject({ message: "An error has occurred" });
      }
      console.log("Email sent successfully");
      return resolve({ message: "Email sent successfully" });
    });
  });
}

module.exports = sendEmail;
