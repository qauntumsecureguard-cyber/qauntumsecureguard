import { getFooter } from ".";

export const getWelcomeTemplate = (name: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_ORIGIN;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Qauntum Secure Guard</title>
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
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
                padding: 36px 24px;
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
                font-size: 40px;
                margin-bottom: 10px;
            }
            .tagline {
                color: #bfdbfe;
                font-size: 14px;
                margin-top: 6px;
                margin-bottom: 0;
            }
            .content {
                padding: 32px 24px;
            }
            .greeting {
                font-size: 17px;
                font-weight: 600;
                margin-bottom: 14px;
                color: #ffffff;
            }
            .message {
                font-size: 14px;
                line-height: 1.8;
                margin-bottom: 24px;
                color: #d4d4d8;
            }
            .features-card {
                background-color: #1a1a1a;
                border: 1px solid #333333;
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
            }
            .features-title {
                font-size: 15px;
                font-weight: 600;
                color: #60a5fa;
                margin-top: 0;
                margin-bottom: 16px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .feature-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 14px;
            }
            .feature-item:last-child {
                margin-bottom: 0;
            }
            .feature-icon {
                font-size: 18px;
                margin-right: 12px;
                line-height: 1.3;
            }
            .feature-text {
                font-size: 13px;
                color: #e4e4e7;
                line-height: 1.5;
            }
            .feature-text strong {
                color: #ffffff;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
                color: #ffffff !important;
                padding: 14px 36px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
                margin: 20px 0;
                box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
            }
            .security-box {
                background-color: #172554;
                border: 1px solid #1e40af;
                border-radius: 6px;
                padding: 16px;
                margin: 24px 0;
                font-size: 12px;
                color: #bfdbfe;
                line-height: 1.6;
            }
            .divider {
                height: 1px;
                background-color: #333333;
                margin: 24px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">⚡</div>
                <h1>Welcome to Qauntum Secure Guard</h1>
                <p class="tagline">Next-Generation Digital Asset Management & Financial Platform</p>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">Hello ${name},</div>
                <div class="message">
                    We are thrilled to welcome you to <strong>Qauntum Secure Guard</strong>. Your account has been successfully created and is ready to use. You now have access to a secure, institutional-grade infrastructure designed for crypto trading, seamless asset swapping, institutional grants, and financial services.
                </div>

                <div class="features-card">
                    <h3 class="features-title">What You Can Do Next</h3>
                    
                    <div class="feature-item">
                        <div class="feature-icon">💰</div>
                        <div class="feature-text">
                            <strong>Instant Welcome Bonus:</strong> We've credited your account with a <strong>2.00 USDT</strong> sign-up bonus to get you started immediately.
                        </div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">🛡️</div>
                        <div class="feature-text">
                            <strong>Complete KYC for +$5 USDT:</strong> Verify your identity in minutes to unlock unlimited withdrawals, trading limits, and receive an additional <strong>5 USDT bonus</strong>.
                        </div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">🔄</div>
                        <div class="feature-text">
                            <strong>Crypto Swap & Trading:</strong> Trade and swap major assets including Bitcoin (BTC), Ethereum, Solana, XRP, and precious metals (Gold, Silver, Platinum).
                        </div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">💳</div>
                        <div class="feature-text">
                            <strong>Quantum Debit Cards:</strong> Apply for Silver or Gold premium debit cards linked directly to your crypto balance for worldwide spending.
                        </div>
                    </div>
                </div>

                <center>
                    <a href="${appUrl}/dashboard" class="cta-button">
                        Access Your Dashboard
                    </a>
                </center>

                <div class="security-box">
                    🔒 <strong>Security Tip:</strong> Qauntum Secure Guard will never ask for your password, private keys, or wallet seed phrases. Always ensure you are on the official platform before logging in.
                </div>

                <div class="divider"></div>

                <div class="message" style="font-size: 13px; margin-bottom: 0;">
                    If you have any questions or need help setting up, our 24/7 customer support team is always available to assist you.
                </div>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};
