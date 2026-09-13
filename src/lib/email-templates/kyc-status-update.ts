import { getFooter } from ".";

export const getKycApprovedTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KYC Approved - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
                font-size: 48px;
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
            .bonus-box {
                background: linear-gradient(135deg, #064E3B 0%, #065F46 100%);
                border: 1px solid #10B981;
                border-radius: 8px;
                padding: 20px 24px;
                margin: 24px 0;
                text-align: center;
            }
            .bonus-box .bonus-label {
                font-size: 13px;
                color: #6EE7B7;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
            }
            .bonus-box .bonus-amount {
                font-size: 36px;
                font-weight: 700;
                color: #10B981;
                margin: 0;
            }
            .bonus-box .bonus-note {
                font-size: 12px;
                color: #6EE7B7;
                margin-top: 8px;
            }
            .status-badge {
                display: inline-block;
                background-color: #064E3B;
                color: #10B981;
                border: 1px solid #10B981;
                padding: 6px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin-bottom: 24px;
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
            .cta-button {
                display: inline-block;
                background-color: #10B981;
                color: #ffffff;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin: 24px 0;
            }
            .divider {
                height: 1px;
                background-color: #444444;
                margin: 24px 0;
            }
            .footer {
                background-color: #1a1a1a;
                padding: 24px;
                text-align: center;
                border-top: 1px solid #444444;
                font-size: 12px;
                color: #888888;
            }
            .benefit-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: 12px;
                font-size: 14px;
                color: #d4d4d8;
            }
            .benefit-icon {
                color: #10B981;
                font-weight: bold;
                flex-shrink: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">✅</div>
                <h1>KYC Verification Approved</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <p class="greeting">Hi ${name},</p>

                <center>
                    <span class="status-badge">✓ Verified</span>
                </center>

                <p class="message">
                    Great news! Your identity has been successfully verified on <strong>Qauntum Secure Guard</strong>.
                    Your account is now fully activated with all features unlocked.
                </p>

                <!-- Bonus Box -->
                <div class="bonus-box">
                    <p class="bonus-label">🎁 Welcome Bonus Credited</p>
                    <p class="bonus-amount">+$5 USDT</p>
                    <p class="bonus-note">Added to your USDT (TRC20) wallet balance</p>
                </div>

                <div class="divider"></div>

                <p class="message"><strong>What you can now do:</strong></p>

                <div class="benefit-item">
                    <span class="benefit-icon">✓</span>
                    <span>Access higher transaction limits for deposits and withdrawals</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">✓</span>
                    <span>Trade and swap crypto assets without restrictions</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">✓</span>
                    <span>Apply for grants and tax refund programs</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">✓</span>
                    <span>Connect and manage external wallets</span>
                </div>

                <div class="divider"></div>

                <div class="info-box">
                    💡 Your $5 USDT bonus has been automatically credited to your USDT (TRC20) balance. You can view it in your dashboard.
                </div>

                <center>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://globalquantumsystem.com"}/dashboard" class="cta-button">
                        Go to Dashboard
                    </a>
                </center>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};

export const getKycRejectedTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KYC Verification Update - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
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
                font-size: 48px;
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
            .status-badge {
                display: inline-block;
                background-color: #450A0A;
                color: #F87171;
                border: 1px solid #DC2626;
                padding: 6px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.5px;
                margin-bottom: 24px;
            }
            .warning-box {
                background-color: #450A0A;
                border-left: 4px solid #DC2626;
                padding: 12px 16px;
                margin: 24px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #FCA5A5;
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
            .cta-button {
                display: inline-block;
                background-color: #06B6D4;
                color: #1a1a1a;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                margin: 24px 0;
            }
            .divider {
                height: 1px;
                background-color: #444444;
                margin: 24px 0;
            }
            .footer {
                background-color: #1a1a1a;
                padding: 24px;
                text-align: center;
                border-top: 1px solid #444444;
                font-size: 12px;
                color: #888888;
            }
            .step-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: 12px;
                font-size: 14px;
                color: #d4d4d8;
            }
            .step-number {
                background-color: #06B6D4;
                color: #1a1a1a;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 700;
                flex-shrink: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">❌</div>
                <h1>KYC Verification Update</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <p class="greeting">Hi ${name},</p>

                <center>
                    <span class="status-badge">✗ Verification Unsuccessful</span>
                </center>

                <p class="message">
                    We were unable to verify your identity at this time. Your KYC documents did not meet our verification requirements.
                    Don't worry — you can resubmit with the correct documents and we'll review them again.
                </p>

                <div class="warning-box">
                    ⚠️ <strong>Common reasons for rejection:</strong> blurry or unclear images, expired documents, documents not matching your account name, or unsupported document type.
                </div>

                <div class="divider"></div>

                <p class="message"><strong>How to resubmit:</strong></p>

                <div class="step-item">
                    <span class="step-number">1</span>
                    <span>Log in to your Qauntum Secure Guard account</span>
                </div>
                <div class="step-item">
                    <span class="step-number">2</span>
                    <span>Go to <strong>Settings → KYC Verification</strong></span>
                </div>
                <div class="step-item">
                    <span class="step-number">3</span>
                    <span>Upload a clear, valid government-issued photo ID (Passport, Driver's License, or National ID)</span>
                </div>
                <div class="step-item">
                    <span class="step-number">4</span>
                    <span>Submit and wait for our team to review within 24–48 hours</span>
                </div>

                <div class="info-box">
                    💡 Ensure your document is not expired, clearly shows your full name, and all four corners are visible in the photo.
                </div>

                <center>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://globalquantumsystem.com"}/kyc" class="cta-button">
                        Resubmit Documents
                    </a>
                </center>

                <div class="divider"></div>

                <p class="message" style="font-size: 13px;">
                    If you believe this is a mistake or need assistance, please contact our support team. We're here to help.
                </p>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};
