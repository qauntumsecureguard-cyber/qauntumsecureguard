import { getFooter } from ".";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);

export function getWithdrawalStatusUpdateTemplate({
  name,
  amount,
  coin,
  network,
  usdValue,
  txHash,
  recipientAddress,
  status,
}: {
  name: string;
  amount: number;
  coin: string;
  network: string;
  usdValue: number;
  txHash: string;
  recipientAddress: string;
  status: "approved" | "completed" | "rejected" | "pending";
}) {
  const safeName = escapeHtml(name);
  const safeCoin = escapeHtml(coin);
  const safeNetwork = escapeHtml(network);
  const safeTxHash = escapeHtml(txHash);
  const safeRecipient = escapeHtml(recipientAddress);
  const formattedAmount = amount.toLocaleString(undefined, { maximumFractionDigits: 8 });
  const formattedUsdValue = usdValue.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const isSuccess = status === "approved" || status === "completed";
  const headerBg = isSuccess ? "#059669" : status === "rejected" ? "#dc2626" : "#d97706";
  const titleText = isSuccess
    ? "Withdrawal Approved & Processed"
    : status === "rejected"
    ? "Withdrawal Request Rejected"
    : "Withdrawal Status Update";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${titleText} - Qauntum Secure Guard</title>
      </head>
      <body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6">
        <main style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          <header style="padding:28px 24px;background:${headerBg};color:#ffffff">
            <p style="margin:0 0 6px;font-size:13px;font-weight:bold;text-transform:uppercase">Qauntum Secure Guard</p>
            <h1 style="margin:0;font-size:24px">${titleText}</h1>
          </header>
          <section style="padding:28px 24px">
            <p style="margin:0 0 16px">Hello ${safeName},</p>
            <p style="margin:0 0 20px">
              ${
                isSuccess
                  ? "Your withdrawal request has been verified and processed successfully. The funds have been released to the recipient address provided."
                  : status === "rejected"
                  ? "Your withdrawal request could not be processed at this time. Please contact 24/7 Support for further details."
                  : "Your withdrawal request is currently under review with our processing team."
              }
            </p>
            <table role="presentation" style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Asset & Network</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${safeCoin} (${safeNetwork})</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Amount</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${formattedAmount} ${safeCoin}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Estimated Value</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right">${formattedUsdValue}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Recipient</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-family:monospace;font-size:11px">${safeRecipient}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Transaction Hash</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-family:monospace;font-size:11px;color:#2563eb;word-break:break-all;">${safeTxHash}</td></tr>
              <tr><td style="padding:12px;color:#6b7280">Status</td><td style="padding:12px;text-align:right;font-weight:bold;text-transform:uppercase">${status}</td></tr>
            </table>
            <p style="margin:20px 0 0;color:#6b7280;font-size:13px">If you have any questions or need further clarification, our 24/7 concierge support team is always ready to assist you.</p>
          </section>
          ${getFooter()}
        </main>
      </body>
    </html>
  `;
}
