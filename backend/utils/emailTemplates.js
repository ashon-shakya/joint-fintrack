const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OurWallet Email</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 40px; margin-bottom: 40px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
        .button { display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: white !important; text-decoration: none; border-radius: 12px; font-weight: 600; text-align: center; margin: 20px 0; transition: background-color 0.3s; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); }
        .button:hover { background-color: #4338ca; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .link-text { color: #4f46e5; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>OurWallet</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} OurWallet. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const getVerificationEmail = (name, url) => {
    const content = `
        <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Verify your email address</h2>
        <p>Hi ${name},</p>
        <p>Thanks for creating an account with OurWallet! Please verify your email address to get started tracking your finances.</p>
        <div style="text-align: center;">
            <a href="${url}" class="button">Verify Email Address</a>
        </div>
        <p style="font-size: 14px; margin-top: 30px;">Or copy and paste this link into your browser:</p>
        <p class="link-text" style="font-size: 14px;">${url}</p>
    `;
    return getBaseTemplate(content);
};

const getPasswordResetEmail = (name, url) => {
    const content = `
        <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <div style="text-align: center;">
            <a href="${url}" class="button">Reset Password</a>
        </div>
        <p style="font-size: 14px; margin-top: 30px;">Or copy and paste this link into your browser:</p>
        <p class="link-text" style="font-size: 14px;">${url}</p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">This link will expire in 10 minutes.</p>
    `;
    return getBaseTemplate(content);
};

module.exports = {
    getVerificationEmail,
    getPasswordResetEmail
};
