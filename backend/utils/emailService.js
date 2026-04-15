const { sendMail } = require("./sendEmail");

// 1. OTP Email

exports.sendOTPEmail = async (email, otp) => {
  const subject = "Verify Your Account - Action Required";

  const content = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 30px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
        <h2 style="color: #111827; margin-top: 0; font-size: 24px;">OTP Verification</h2>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
          Hello, <br/> Thank you for registering. Please use the following One-Time Password (OTP) to complete your verification:
        </p>
        <div style="margin: 30px 0;">
          <span style="display: inline-block; padding: 15px 35px; background-color: #eff6ff; color: #2563eb; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; border: 2px dashed #bfdbfe;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #ef4444; font-weight: 500; margin-bottom: 30px;">
          ⏳ This OTP will expire in 5 minutes.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">
          If you did not request this email, please safely ignore it or contact support if you have concerns.
        </p>
      </div>
    </div>
  `;

  return await sendMail({ email, subject, content });
};


// 2. Email Verification Success 

exports.sendVerificationEmail = async (email) => {
  const subject = "Account Verified 🎉";

  const content = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0fdf4; padding: 30px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
        <h2 style="color: #166534; margin-top: 0; font-size: 24px;">Welcome Aboard!</h2>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Your account has been successfully verified. You can now access all features of our platform.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 14px; color: #6b7280;">
          We are thrilled to have you with us!
        </p>
      </div>
    </div>
  `;

  return await sendMail({ email, subject, content });
};

// 3. Reset Password Email

exports.sendResetPasswordEmail = async (email, otp) => {
  const subject = "Reset Your Password - Security Alert";

  const content = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fef2f2; padding: 30px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
        <h2 style="color: #991b1b; margin-top: 0; font-size: 24px;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
          We received a request to reset your password. Use the OTP below to proceed:
        </p>
        <div style="margin: 30px 0;">
          <span style="display: inline-block; padding: 15px 35px; background-color: #fef2f2; color: #dc2626; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; border: 2px dashed #fecaca;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #ef4444; font-weight: 500; margin-bottom: 30px;">
          ⏳ This OTP will expire in 5 minutes.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">
          If you did not request a password reset, please ignore this email. Your account remains secure.
        </p>
      </div>
    </div>
  `;

  return await sendMail({ email, subject, content });
};

// 4. Welcome Email

exports.sendWelcomeEmail = async (email, username) => {
  const subject = "🎉 Welcome to Our Platform!";

  const content = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 30px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #111827; margin-top: 0; font-size: 24px; text-align: center;">
          🎉 Congratulations, <span style="color: #2563eb;">${username}</span>!
        </h2>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6; text-align: center; margin-bottom: 20px;">
          Your account has been successfully created. We're incredibly excited to have you on board 🚀
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #374151; background-color: #f3f4f6; padding: 15px; border-radius: 6px; display: inline-block;">
            Get started by exploring your dashboard!
          </p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
          If you did not create this account, please contact our support team immediately.
        </p>
      </div>
    </div>
  `;

  return await sendMail({ email, subject, content });
};

// 5. Password Changed Email

exports.sendPasswordChangedEmail = async (email, username) => {
  const subject = "🔐 Password Changed Successfully";

  const content = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 30px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Hi ${username},</h2>
        <p style="font-size: 16px; color: #334155; line-height: 1.6;">
          This is a confirmation that the password for your account has been successfully changed.
        </p>
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0;">
          <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 500;">
            ⚠️ If this was not you, please reset your password immediately and contact our support team to secure your account.
          </p>
        </div>
        <br/>
        <p style="font-size: 16px; color: #475569; margin-bottom: 0;">
          Thanks,<br/>
          <strong style="color: #0f172a;">Your The_Curator Team</strong>
        </p>
      </div>
    </div>
  `;

  return await sendMail({ email, subject, content });
};