import { getFooter } from ".";

export const getEmailVerificationTemplate = (name: string, url: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
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
                background-color: #06B6D4;
                color: #1a1a1a;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin: 24px 0;
                transition: background-color 0.3s;
            }
            .cta-button:hover {
                background-color: #0891B2;
            }
            .info-box {
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
                color: #06B6D4;
                text-decoration: none;
            }
            .divider {
                height: 1px;
                background-color: #444444;
                margin: 24px 0;
            }
            .verification-code {
                background-color: #1a1a1a;
                border: 2px solid #06B6D4;
                padding: 16px;
                border-radius: 6px;
                text-align: center;
                margin: 24px 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 4px;
                color: #06B6D4;
                font-family: 'Courier New', monospace;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">✓</div>
                <h1>Verify Your Email</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <p class="greeting">Hi ${name},</p>

                <p class="message">
                    Welcome to Qauntum Secure Guard To complete your account setup and secure your crypto assets, please verify your email address.
                </p>

                <p class="message">
                    Click the button below to verify your email:
                </p>

                <center>
                    <a href="${url}" class="cta-button">Verify Email</a>
                </center>

                <p class="message">
                    Or copy and paste this link in your browser:<br>
                    <span class="code-block">${url}</span>
                </p>

                <div class="info-box">
                    <strong>⏱️ Link Expires In:</strong> This verification link will expire in 1 hour.
                </div>

                <div class="divider"></div>

                <p class="message">
                    <strong>Why verify your email?</strong><br>
                    Email verification helps us:
                </p>
                <ul style="color: #d4d4d8; font-size: 14px; margin: 12px 0;">
                    <li>Secure your account from unauthorized access</li>
                    <li>Send important security notifications</li>
                    <li>Help you recover your account if needed</li>
                    <li>Comply with security best practices</li>
                </ul>

                <div class="divider"></div>

                <p class="message" style="font-size: 13px;">
                    <strong>Didn't create this account?</strong><br>
                    If you didn't sign up for Qauntum Secure Guard, please ignore this email. Your email address will not be used unless you complete the verification process.
                </p>
            </div>

             <!-- Footer -->
              ${getFooter()}
        </div>
    </body>
    </html>
  `;
}