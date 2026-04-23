// const nodemailer = require("nodemailer");
// // export const data = "dasd"

// exports.createTransport = async () => {
//     const transporter = await nodemailer.createTransport({
//         pool: true, // MAIN MAGIC: Connection open rakhega reuse karne ke liye
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: false,
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASSWORD
//         },
//         maxConnections: 5, // Ek sath 5 parallel emails bhej sakta hai
//         maxMessages: 100 // Ek connection par 100 emails tak bhejega before reconnecting
//     });
//     return transporter;
// }


const nodemailer = require("nodemailer");

let transporter = null;

const createTransport = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            pool: true,
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            maxConnections: 5,
            maxMessages: 100
        });

        console.log("✅ Transporter created");
    }

    return transporter;
};

module.exports = { createTransport };