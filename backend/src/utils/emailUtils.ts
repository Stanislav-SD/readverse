import nodemailer from 'nodemailer';

// Email Transporter for Notifications
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    secure: true,
});

const sendEmail = async (to: string, subject: string, text: string) => {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};

export default sendEmail;