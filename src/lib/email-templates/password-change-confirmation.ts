import { getFooter } from ".";

export const getPasswordChangeConfirmationTemplate = (name: string) => {
    return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed - Qauntum Secure Guard</title>
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
                  color: #d1d5db;
              }
              .success-box {
                  background-color: #064e3b;
                  border-left: 4px solid #10b981;
                  padding: 16px 20px;
                  margin: 24px 0;
                  border-radius: 4px;
                  font-size: 14px;
                  color: #a7f3d0;
              }
              .info-box {
                  background-color: #1a1a1a;
                  padding: 16px 20px;
                  border-radius: 6px;
                  margin: 24px 0;
                  border-left: 4px solid #06B6D4;
              }
              .info-item {
                  display: flex;
                  margin-bottom: 12px;
                  font-size: 13px;
                  color: #d1d5db;
              }
              .info-item:last-child {
                  margin-bottom: 0;
              }
              .info-label {
                  font-weight: 600;
                  color: #fafafa;
                  min-width: 120px;
              }
              .footer {
                  background-color: #1a1a1a;
                  padding: 24px;
                  text-align: center;
                  border-top: 1px solid #444444;
                  font-size: 12px;
                  color: #9ca3af;
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
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>✓ Password Changed</h1>
              </div>

              <div class="content">
                  <p class="greeting">Hi ${name},</p>

                  <p class="message">
                      This email confirms that your password has been successfully changed.
                  </p>

                  <div class="success-box">
                      <strong>✓ Password Updated:</strong> Your new password is now active on your account.
                  </div>

                  <div class="info-box">
                      <div class="info-item">
                          <span class="info-label">Date & Time:</span>
                          <span>
                            ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                          </span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">Account:</span>
                          <span>${name}</span>
                      </div>
                      <div class="info-item">
                          <span class="info-label">Action:</span>
                          <span>Password Change</span>
                      </div>
                  </div>

                  <div class="divider"></div>

                  <p class="message" style="font-size: 13px; color: #9ca3af;">
                      This is an automated notification. No action is required on your part.
                  </p>
              </div>

              ${getFooter()}
          </div>
      </body>
    </html>
  `
}