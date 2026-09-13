import { getFooter } from ".";

export const getCardApplicationTemplate = (
  cardType: string,
  fullName: string,
  dob: string,
  phone: string,
  email: string,
  country: string,
  state: string,
  address: string,
  idNumber: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Card Application - Qauntum Secure Guard</title>
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
                background: linear-gradient(135deg, #EAB308 0%, #A16207 100%);
                padding: 32px 24px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .logo {
                font-size: 32px;
                margin-bottom: 12px;
            }
            .content {
                padding: 32px 24px;
            }
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #EAB308;
                margin-top: 24px;
                margin-bottom: 12px;
                border-bottom: 1px solid #444444;
                padding-bottom: 8px;
            }
            .data-row {
                display: flex;
                margin-bottom: 12px;
                border-bottom: 1px solid #404040;
                padding-bottom: 8px;
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
            }
            .card-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 4px;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 14px;
                background-color: ${cardType.toLowerCase() === 'gold' ? '#EAB308' : '#94a3b8'};
                color: ${cardType.toLowerCase() === 'gold' ? '#000000' : '#000000'};
            }
            .footer {
                background-color: #1a1a1a;
                padding: 24px;
                text-align: center;
                border-top: 1px solid #444444;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">💳</div>
                <h1>New Card Application</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <div style="text-align: center; margin-bottom: 24px;">
                    <span class="card-badge">${cardType} CARD</span>
                </div>

                <div class="section-title">Applicant Details</div>
                
                <div class="data-row">
                    <span class="data-label">Full Name:</span>
                    <span class="data-value">${fullName}</span>
                </div>
                
                <div class="data-row">
                    <span class="data-label">Date of Birth:</span>
                    <span class="data-value">${dob}</span>
                </div>

                <div class="data-row">
                    <span class="data-label">ID Number:</span>
                    <span class="data-value">${idNumber}</span>
                </div>

                <div class="section-title">Contact Information</div>

                <div class="data-row">
                    <span class="data-label">Email:</span>
                    <span class="data-value"><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></span>
                </div>

                <div class="data-row">
                    <span class="data-label">Phone:</span>
                    <span class="data-value">${phone}</span>
                </div>

                <div class="section-title">Address</div>

                <div class="data-row">
                    <span class="data-label">Country:</span>
                    <span class="data-value">${country}</span>
                </div>

                <div class="data-row">
                    <span class="data-label">State:</span>
                    <span class="data-value">${state}</span>
                </div>

                <div class="data-row">
                    <span class="data-label">Address:</span>
                    <span class="data-value">${address}</span>
                </div>
            </div>

            <!-- Footer -->
            ${getFooter()}
        </div>
    </body>
    </html>
    `;
}
