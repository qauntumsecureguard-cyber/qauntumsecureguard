import { getFooter } from ".";

export const getEmailVerificationTemplate = (otp: string, name?: string) => {
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
                background-color: #262626;
                border: 1px solid #404040;
                border-radius: 12px;
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
                font-size: 26px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }
            .logo {
                font-size: 28px;
                margin-bottom: 8px;
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
                margin-bottom: 20px;
                color: #d4d4d8;
            }
            .otp-container {
                background-color: #171717;
                border: 2px dashed #06B6D4;
                border-radius: 10px;
                padding: 24px;
                text-align: center;
                margin: 28px 0;
            }
            .otp-label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #a1a1aa;
                margin-bottom: 8px;
            }
            .otp-code {
                font-family: 'Courier New', Courier, monospace;
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #22D3EE;
                margin: 0;
                user-select: all;
            }
            .info-box {
                background-color: #0c4a6e;
                border-left: 4px solid #06B6D4;
                padding: 12px 16px;
                margin: 24px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #bae6fd;
            }
            .divider {
                height: 1px;
                background-color: #404040;
                margin: 24px 0;
            }
            .security-tips {
                background-color: #171717;
                border-radius: 8px;
                padding: 16px;
                margin: 20px 0;
            }
            .security-tips ul {
                margin: 8px 0 0 0;
                padding-left: 20px;
                color: #a1a1aa;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">🛡️</div>
                <h1>Email Verification Code</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <p class="greeting">Hi ${name || "Valued User"},</p>

                <p class="message">
                    Thank you for signing up with <strong>Qauntum Secure Guard</strong>. To complete your account verification and secure your assets, please use the 6-digit verification code below:
                </p>

                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                </div>

                <div class="info-box">
                    <strong>⏱️ Code Expiration:</strong> This code is valid for <strong>5 minutes</strong>.
                </div>

                <div class="security-tips">
                    <strong style="color: #fafafa; font-size: 13px;">🔒 Security Reminder:</strong>
                    <ul>
                        <li>Never share this code with anyone, including Qauntum Secure Guard staff.</li>
                        <li>Qauntum Secure Guard will never ask for your verification code via phone or chat.</li>
                    </ul>
                </div>

                <div class="divider"></div>

                <p class="message" style="font-size: 12px; color: #71717a; margin-bottom: 0;">
                    If you did not request this verification code, please ignore this email or contact our security team immediately.
                </p>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
  `;
}