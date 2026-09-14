import { getFooter } from ".";

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_ORIGIN;

export const getGrantSubmissionAdminTemplate = ({
  applicantName,
  userEmail,
  applicationType,
  companyName,
  ein,
  fullName,
  ssn,
  projectDescription,
  grantId,
}: {
  applicantName: string;
  userEmail: string;
  applicationType: string;
  companyName?: string;
  ein?: string;
  fullName?: string;
  ssn?: string;
  projectDescription: string;
  grantId: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Grant Application - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
            .badge {
                display: inline-block;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                background-color: rgba(16, 185, 129, 0.2);
                border: 1px solid #10B981;
                color: #6ee7b7;
                margin-bottom: 20px;
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
            .desc-box {
                background-color: #1a1a1a;
                border: 1px solid #333333;
                border-radius: 6px;
                padding: 14px;
                font-size: 13px;
                color: #e4e4e7;
                line-height: 1.6;
                white-space: pre-wrap;
                margin-top: 8px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
                <div class="logo">🏛️</div>
                <h1>New Grant Application</h1>
            </div>

            <div class="content">
                <center>
                    <span class="badge">${applicationType.toUpperCase()} GRANT APPLICATION</span>
                </center>

                <div class="section-title">Applicant Details</div>
                <div class="data-row">
                    <span class="data-label">Account User:</span>
                    <span class="data-value">${applicantName}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">User Email:</span>
                    <span class="data-value"><a href="mailto:${userEmail}" style="color: #60a5fa;">${userEmail}</a></span>
                </div>
                <div class="data-row">
                    <span class="data-label">Application ID:</span>
                    <span class="data-value"><code>${grantId}</code></span>
                </div>

                <div class="section-title">Grant Information</div>
                ${
                  applicationType === "company"
                    ? `
                <div class="data-row">
                    <span class="data-label">Company Name:</span>
                    <span class="data-value">${companyName || "N/A"}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">EIN:</span>
                    <span class="data-value">${ein || "N/A"}</span>
                </div>
                `
                    : `
                <div class="data-row">
                    <span class="data-label">Full Legal Name:</span>
                    <span class="data-value">${fullName || "N/A"}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">SSN:</span>
                    <span class="data-value">${ssn ? "***-**-" + ssn.slice(-4) : "N/A"}</span>
                </div>
                `
                }

                <div class="section-title">Project Proposal / Description</div>
                <div class="desc-box">${projectDescription}</div>

                <center>
                    <a href="${getAppUrl()}/admin/grants" class="cta-button">
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

export const getGrantSubmissionUserTemplate = ({
  name,
  grantId,
  applicationType,
}: {
  name: string;
  grantId: string;
  applicationType: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grant Application Received - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
                <div class="logo">🏛️</div>
                <h1>Grant Application Received</h1>
            </div>

            <div class="content">
                <div class="greeting">Hello ${name},</div>
                <div class="message">
                    Thank you for applying for a financial grant through <strong>Qauntum Secure Guard</strong>. Your application has been successfully logged into our system and queued for institutional review.
                </div>

                <div class="info-card">
                    <div class="info-row">
                        <span class="info-label">Application Type:</span>
                        <span class="info-val">${applicationType.toUpperCase()}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Application ID:</span>
                        <span class="info-val"><code>${grantId}</code></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-val" style="color: #f59e0b;">Under Review (Pending)</span>
                    </div>
                </div>

                <div class="timeline-box">
                    ⏱️ <strong>Review Timeline:</strong> Our grant evaluation committee reviews all submissions within <strong>2 to 5 business days</strong>. You will receive an email update as soon as a decision is made.
                </div>

                <center>
                    <a href="${getAppUrl()}/grants/track" class="cta-button">
                        Track Application Status
                    </a>
                </center>
            </div>

            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};

export const getGrantStatusUpdateTemplate = ({
  name,
  grantId,
  status,
}: {
  name: string;
  grantId: string;
  status: "approved" | "rejected" | "pending";
}) => {
  const isApproved = status === "approved";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grant Application ${isApproved ? "Approved" : "Update"} - Qauntum Secure Guard</title>
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
                background: ${isApproved ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)"};
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
                background: ${isApproved ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"};
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
                <div class="logo">${isApproved ? "🎉" : "📋"}</div>
                <h1>${isApproved ? "Grant Application Approved!" : "Grant Application Status Update"}</h1>
            </div>

            <div class="content">
                <div class="greeting">Dear ${name},</div>

                ${
                  isApproved
                    ? `
                <div class="message">
                    We are pleased to inform you that your grant application has been <strong>approved</strong> by the Qauntum Secure Guard review committee!
                </div>

                <div class="status-box">
                    <div class="status-title">Status: APPROVED ✓</div>
                    <div class="status-sub">Your grant has passed verification and has been authorized for processing.</div>
                </div>

                <div class="details-card">
                    <div class="detail-row">
                        <span style="color: #a1a1aa;">Application ID:</span>
                        <span style="color: #ffffff;"><code>${grantId}</code></span>
                    </div>
                    <div class="detail-row">
                        <span style="color: #a1a1aa;">Next Steps:</span>
                        <span style="color: #6ee7b7; font-weight: 600;">Disbursement Allocation Underway</span>
                    </div>
                </div>

                <div class="message">
                    Our disbursements team is currently allocating the funds to your account. You can log into your account at any time to monitor your application tracker.
                </div>

                <center>
                    <a href="${getAppUrl()}/grants/track" class="cta-button">
                        View Grant Tracker
                    </a>
                </center>
                `
                    : `
                <div class="message">
                    Thank you for your interest in our grant program. After careful evaluation, we regret to inform you that your grant application could not be approved at this time.
                </div>

                <div class="status-box">
                    <div class="status-title">Status: NOT APPROVED</div>
                    <div class="status-sub">Does not currently meet the program criteria or documentation requirements.</div>
                </div>

                <div class="details-card">
                    <div class="detail-row">
                        <span style="color: #a1a1aa;">Application ID:</span>
                        <span style="color: #ffffff;"><code>${grantId}</code></span>
                    </div>
                </div>

                <div class="message">
                    Common reasons include incomplete project documentation, unverified identity information, or quota limits for this round. You are welcome to submit a revised application in the future.
                </div>

                <center>
                    <a href="${getAppUrl()}/grants/apply" class="cta-button">
                        Review & Re-apply
                    </a>
                </center>
                `
                }

                <div class="divider"></div>
                <p style="font-size: 13px; color: #a1a1aa; margin-bottom: 0;">
                    If you have questions regarding this decision, our institutional grant support team is ready to assist you.
                </p>
            </div>

            ${getFooter()}
        </div>
    </body>
    </html>
  `;
};
