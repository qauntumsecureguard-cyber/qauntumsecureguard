import { getFooter } from ".";

interface CardStatusEmailProps {
  name: string;
  cardType: string;
  cardNumber?: string;
  expiryDate?: string;
  status: "approved" | "rejected" | "pending";
}

export function getCardStatusUpdateTemplate({
  name,
  cardType,
  cardNumber,
  expiryDate,
  status,
}: CardStatusEmailProps) {
  const isApproved = status === "approved";
  const isGold = cardType.toLowerCase() === "gold";

  const primaryColor = isGold ? "#EAB308" : "#94A3B8";
  const gradient = isGold
    ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    : "linear-gradient(135deg, #64748B 0%, #334155 100%)";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Card Application Status - Qauntum Secure Guard</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #fafafa;
                background-color: #0f172a;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #1e293b;
                border: 1px solid #334155;
                border-radius: 16px;
                overflow: hidden;
            }
            .header {
                background: ${gradient};
                padding: 36px 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 26px;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .content {
                padding: 32px 24px;
            }
            .badge {
                display: inline-block;
                padding: 6px 16px;
                border-radius: 20px;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 13px;
                background-color: ${isApproved ? "#22c55e" : "#ef4444"};
                color: #ffffff;
                margin-bottom: 20px;
            }
            .card-box {
                background: linear-gradient(135deg, ${isGold ? "#78350f" : "#1e293b"} 0%, ${isGold ? "#451a03" : "#0f172a"} 100%);
                border: 1px solid ${primaryColor}55;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
            }
            .card-title {
                color: ${primaryColor};
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 16px;
            }
            .card-num {
                font-family: 'Courier New', monospace;
                font-size: 20px;
                letter-spacing: 3px;
                color: #ffffff;
                font-weight: bold;
                margin-bottom: 16px;
            }
            .card-details {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #94a3b8;
            }
            .btn {
                display: inline-block;
                background-color: ${isGold ? "#EAB308" : "#3b82f6"};
                color: #000000;
                font-weight: 700;
                padding: 14px 28px;
                border-radius: 8px;
                text-decoration: none;
                text-align: center;
                margin-top: 20px;
            }
            .footer {
                background-color: #0f172a;
                padding: 24px;
                text-align: center;
                border-top: 1px solid #334155;
                font-size: 12px;
                color: #64748b;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="font-size: 40px; margin-bottom: 10px;">💳</div>
                <h1>${isApproved ? "Card Approved & Issued!" : "Card Application Status"}</h1>
            </div>

            <div class="content">
                <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>

                ${
                  isApproved
                    ? `
                    <div style="text-align: center;">
                        <span class="badge">APPROVED & ACTIVE</span>
                    </div>
                    <p>Congratulations! Your <strong>Qauntum Secure Guard ${cardType.toUpperCase()} Card</strong> has been approved and issued to your account.</p>

                    <div class="card-box">
                        <div class="card-title">Qauntum Secure Guard • ${cardType.toUpperCase()}</div>
                        <div class="card-num">${cardNumber || "•••• •••• •••• ••••"}</div>
                        <div class="card-details">
                            <div>
                                <span style="display:block; font-size: 10px; text-transform: uppercase;">Cardholder</span>
                                <strong style="color: #ffffff; font-size: 13px;">${name.toUpperCase()}</strong>
                            </div>
                            <div style="text-align: right;">
                                <span style="display:block; font-size: 10px; text-transform: uppercase;">Valid Thru</span>
                                <strong style="color: #ffffff; font-size: 13px;">${expiryDate || "12/28"}</strong>
                            </div>
                        </div>
                    </div>

                    <p>You can now view and manage your virtual card directly from your dashboard.</p>
                    `
                    : `
                    <div style="text-align: center;">
                        <span class="badge">APPLICATION DECLINED</span>
                    </div>
                    <p>Thank you for your interest in the <strong>Qauntum Secure Guard ${cardType.toUpperCase()} Card</strong>. After careful review, we regret to inform you that your application could not be approved at this time.</p>
                    <p>Please ensure your account meets the required minimum balance and verification criteria before reapplying.</p>
                    `
                }

                <div style="text-align: center; margin-top: 28px;">
                    <a href="${process.env.BETTER_AUTH_URL || "https://qauntumsecureguard.com"}/card" class="btn" style="color: ${isGold ? '#000000' : '#ffffff'};">
                        View Your Card Hub
                    </a>
                </div>
            </div>

            ${getFooter()}
        </div>
    </body>
    </html>
  `;
}
