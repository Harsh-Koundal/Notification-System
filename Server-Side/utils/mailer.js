import nodemailer from "nodemailer";
import dotnev from "dotenv";

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT),
    secure:false,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
    },
});

export const sendMail = async({to,subject,text,html})=>{
    if(!to || typeof to !== "string")
        throw new Error("Invalid Recipient email");

    const mailOptions = {
        from:`"HARSH" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
};