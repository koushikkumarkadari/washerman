// utils/sendOtpEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '22211a1251@gmail.com',
    pass: 'wvcb nxwk eagq putu'
  }
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: '22211a1251@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

export default sendOtpEmail;
