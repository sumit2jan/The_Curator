const { createTransport } = require("../service/nodeMailer");

exports.sendMail = async ({ email, subject, content }) => {
    try {
        const transporter = await createTransport()
        //let emaildata;
        // console.log("emailData", emaildata)
        const info = await transporter.sendMail({
            from: `${process.env.SMTP_APP_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: subject,
            html: content
        });
        return true

    } catch (error) {
        throw new Error(error.message);
    }
}