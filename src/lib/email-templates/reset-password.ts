import { getFooter } from ".";

export const getResetPasswordTemplate = (name: string, url: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Qauntum Secure Guard</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #fafafa;
                background-color: #1a1a1a;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #333333;
                border: 1px solid #444444;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%);
                padding: 32px 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
            }
            .logo {
                font-size: 24px;
                margin-bottom: 12px;
            }
            .content {
                padding: 32px 24px;
            }
            .greeting {
                font-size: 16px;
                margin-bottom: 16px;
                color: #fafafa;
            }
            .message {
                font-size: 14px;
                line-height: 1.8;
                margin-bottom: 24px;
                color: #d4d4d8;
            }
            .cta-button {
                display: inline-block;
                background-color: #4F46E5;
                color: #ffffff;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin: 24px 0;
                transition: background-color 0.3s;
            }
            .cta-button:hover {
                background-color: #3730A3;
            }
            .warning {
                background-color: #7F1D1D;
                border-left: 4px solid #DC2626;
                padding: 12px 16px;
                margin: 24px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #FECACA;
            }
            .expiration {
                background-color: #1E3A8A;
                border-left: 4px solid #06B6D4;
                padding: 12px 16px;
                margin: 24px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #A5F3FC;
            }
            .code-block {
                background-color: #1a1a1a;
                padding: 8px 12px;
                border-radius: 4px;
                display: inline-block;
                margin-top: 8px;
                word-break: break-all;
                color: #06B6D4;
                font-family: 'Courier New', monospace;
            }
            .footer {
                background-color: #1a1a1a;
                padding: 24px;
                text-align: center;
                border-top: 1px solid #444444;
                font-size: 12px;
                color: #888888;
            }
            .footer-link {
                color: #4F46E5;
                text-decoration: none;
            }
            .divider {
                height: 1px;
                background-color: #444444;
                margin: 24px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">🔐</div>
                <h1>Password Reset</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <p class="greeting">Hi ${name},</p>

                <p class="message">
                    We received a request to reset the password for your Qauntum Secure Guard account. If you didn't make this request, you can safely ignore this email.
                </p>

                <p class="message">
                    To reset your password, click the button below:
                </p>

                <center>
                    <a href="${url}" class="cta-button">Reset Password</a>
                </center>

                <p class="message">
                    Or copy and paste this link in your browser:<br>
                    <span class="code-block">${url}</span>
                </p>

                <div class="expiration">
                    <strong>⏱️ Link Expires In:</strong> This reset link will expire in 1 hour for security reasons.
                </div>

                <div class="warning">
                    <strong>🔒 Security Notice:</strong> Never share this link with anyone. Qauntum Secure Guard staff will never ask for your password or this link.
                </div>

                <div class="divider"></div>

                <p class="message" style="font-size: 13px;">
                    <strong>Didn't request a password reset?</strong><br>
                    If you didn't request this password reset, please secure your account immediately by changing your password or contacting our support team.
                </p>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
  `;
}