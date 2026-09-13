import { getFooter } from "."

export const getAccountDeletionConfirmationTemplate = (name: string, url: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Account Deletion - Qauntum Secure Guard</title>
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
                  background: linear-gradient(135deg, #EA580C 0%, #C2410C 100%);
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
              .warning {
                  background-color: #7f1d1d;
                  border-left: 4px solid #EA580C;
                  padding: 16px;
                  margin: 24px 0;
                  border-radius: 4px;
                  font-size: 13px;
                  color: #fecaca;
              }
              .deletion-items {
                  background-color: #1a1a1a;
                  padding: 16px;
                  border-radius: 6px;
                  margin: 24px 0;
              }
              .deletion-item {
                  display: flex;
                  margin-bottom: 12px;
                  font-size: 13px;
                  color: #d1d5db;
              }
              .deletion-item:last-child {
                  margin-bottom: 0;
              }
              .deletion-icon {
                  color: #EA580C;
                  margin-right: 12px;
                  font-weight: bold;
              }
              .cta-button {
                  display: inline-block;
                  background-color: #EA580C;
                  color: #ffffff;
                  padding: 14px 36px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: 600;
                  margin: 24px 0;
                  transition: background-color 0.3s;
                  font-size: 15px;
              }
              .cta-button:hover {
                  background-color: #C2410C;
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
              code {
                  background-color: #1a1a1a;
                  padding: 8px 12px;
                  border-radius: 4px;
                  display: inline-block;
                  margin-top: 8px;
                  word-break: break-all;
                  color: #06B6D4;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>⚠️ Confirm Account Deletion</h1>
              </div>

              <div class="content">
                  <p class="greeting">Hi ${name},</p>

                  <p class="message">
                      We received a request to delete your Qauntum Secure Guard account. To proceed with the deletion, please confirm by clicking the button below.
                  </p>

                  <div class="warning">
                      <strong>⚠️ Important:</strong> This action is permanent and cannot be undone. Once confirmed, all your data will be immediately and permanently deleted.
                  </div>

                  <p class="message">
                      <strong>The following data will be permanently deleted:</strong>
                  </p>

                  <div class="deletion-items">
                      <div class="deletion-item">
                          <span class="deletion-icon">✕</span>
                          <span>All portfolio data and asset information</span>
                      </div>
                      <div class="deletion-item">
                          <span class="deletion-icon">✕</span>
                          <span>Transaction history and records</span>
                      </div>
                      <div class="deletion-item">
                          <span class="deletion-icon">✕</span>
                          <span>Account settings and preferences</span>
                      </div>
                      <div class="deletion-item">
                          <span class="deletion-icon">✕</span>
                          <span>All active sessions and login history</span>
                      </div>
                  </div>

                  <p class="message">
                      <strong>Click the button below to permanently delete your account:</strong>
                  </p>

                  <center>
                      <a href="${url}" class="cta-button">Confirm Account Deletion</a>
                  </center>

                  <p class="message" style="text-align: center; font-size: 13px; color: #9ca3af;">
                      Or copy and paste this link in your browser:<br>
                      <code>${url}</code>
                  </p>

                  <div class="divider"></div>

                  <p class="message" style="font-size: 13px; color: #9ca3af;">
                      If you did not request this account deletion, please ignore this email. Your account will remain active and secure.
                  </p>
              </div>

              ${getFooter()}
          </div>
      </body>
    </html>
  `
}