const nodemailer = require("nodemailer");
// export const data = "dasd"

exports.createTransport = async () => {
    const transporter = await nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });
    return transporter;
}


