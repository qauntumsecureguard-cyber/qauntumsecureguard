import { getFooter } from ".";

export const getSignUpBonusTemplate = (name: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_ORIGIN;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>2 USDT Sign-Up Bonus Credited - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
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
                font-size: 42px;
                margin-bottom: 10px;
            }
            .tagline {
                color: #fef3c7;
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
            .bonus-card {
                background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
                border: 2px solid #F59E0B;
                border-radius: 12px;
                padding: 28px 24px;
                text-align: center;
                margin: 24px 0;
            }
            .bonus-label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #fde68a;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .bonus-amount {
                font-size: 44px;
                font-weight: 800;
                color: #ffffff;
                margin: 0 0 6px 0;
                line-height: 1.1;
            }
            .bonus-network {
                display: inline-block;
                background-color: rgba(245, 158, 11, 0.25);
                border: 1px solid rgba(245, 158, 11, 0.5);
                color: #fef3c7;
                padding: 4px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            .bonus-status {
                margin-top: 14px;
                font-size: 13px;
                color: #a7f3d0;
                font-weight: 500;
            }
            .upsell-box {
                background-color: #064e3b;
                border: 1px solid #10b981;
                border-radius: 8px;
                padding: 18px 20px;
                margin: 24px 0;
            }
            .upsell-title {
                font-size: 14px;
                font-weight: 700;
                color: #6ee7b7;
                margin-top: 0;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
            }
            .upsell-text {
                font-size: 13px;
                color: #d1fae5;
                line-height: 1.6;
                margin: 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                color: #ffffff !important;
                padding: 14px 36px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
                margin: 16px 0 10px 0;
                box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
            }
            .secondary-link {
                display: block;
                color: #38bdf8;
                text-decoration: none;
                font-size: 13px;
                font-weight: 500;
                margin-top: 8px;
            }
            .secondary-link:hover {
                text-decoration: underline;
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
                <div class="logo">🎁</div>
                <h1>Sign-Up Bonus Credited!</h1>
                <p class="tagline">Your welcome gift has arrived in your account</p>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">Congratulations, ${name}!</div>
                <div class="message">
                    Thank you for joining <strong>Qauntum Secure Guard</strong>. As our way of saying welcome to our ecosystem, your registration bonus has been successfully deposited into your wallet.
                </div>

                <!-- Bonus Highlight Card -->
                <div class="bonus-card">
                    <div class="bonus-label">Sign-Up Bonus Credited</div>
                    <div class="bonus-amount">+2.00 USDT</div>
                    <span class="bonus-network">Network: Solana</span>
                    <div class="bonus-status">✓ Credited & Ready for Trading</div>
                </div>

                <!-- Extra Bonus Callout -->
                <div class="upsell-box">
                    <div class="upsell-title">
                        🚀 Want to earn another $5.00 USDT?
                    </div>
                    <p class="upsell-text">
                        Complete your identity verification (KYC) now and get an extra <strong>5 USDT bonus</strong> credited automatically upon approval. It takes less than 2 minutes!
                    </p>
                </div>

                <center>
                    <a href="${appUrl}/dashboard" class="cta-button">
                        View Balance in Dashboard
                    </a>
                    <a href="${appUrl}/kyc" class="secondary-link">
                        Complete KYC for +$5 USDT →
                    </a>
                </center>

                <div class="divider"></div>

                <div class="message" style="font-size: 13px; margin-bottom: 0;">
                    You can start using your USDT balance to swap crypto assets, purchase digital tokens, or explore investment opportunities on our platform.
                </div>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};
