import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const createTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendMail = async ({ to, subject, text, html }) => {
    if (!to || typeof to !== "string")
        throw new Error("Invalid Recipient email");

    const transporter = createTransporter();

    const mailOptions = {
        from: `"HARSH" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
};