import nodemailer from "nodemailer";

const sendOtp = async (to, username, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      // secure: false,
      auth: {
        user: process.env.gmail,
        pass: process.env.AppPass,
      },
    });
    transporter.verify().then(console.log).catch(console.error);
    const info = await transporter.sendMail({
      from: "VidZilla <pankajtiwari6761@gmail.com>",
      to: to,
      subject: "OTP for VidZilla Account Verification",
      html: `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                </head>
                <body>
                    <p>Dear <strong>${username}</strong>,</p>

                    <p>Thank you for using VidZilla! To complete your account verification or login process, please use the One-Time Password (OTP) provided below:</p>

                    <p><strong>Your OTP:</strong> <strong>${otp}</strong></p>

                    <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone for security reasons.</p>

                    <p>If you did not request this OTP or need any assistance, please contact our support team immediately.</p>

                    <p>Thank you for being a part of the VidZilla community!</p>

                    <p>Best regards,<br>The VidZilla Team</p>
                </body>
            </html>
`,
    });
    return info;
  } catch (error) {
    throw error;
  }
};

export default sendOtp;
