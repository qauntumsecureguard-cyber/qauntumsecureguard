import { getFooter } from ".";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);

export function getDepositRejectedTemplate({
  name,
  amount,
  coin,
  network,
  usdValue,
  depositId,
}: {
  name: string;
  amount: number;
  coin: string;
  network: string;
  usdValue: number;
  depositId: string;
}) {
  const safeName = escapeHtml(name);
  const safeCoin = escapeHtml(coin);
  const safeNetwork = escapeHtml(network);
  const safeDepositId = escapeHtml(depositId);
  const formattedAmount = amount.toLocaleString(undefined, { maximumFractionDigits: 8 });
  const formattedUsdValue = usdValue.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
  const networkLabel = network === "NATIVE" ? "Native network" : safeNetwork;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deposit Needs Attention - Qauntum Secure Guard</title>
      </head>
      <body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6">
        <main style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          <header style="padding:28px 24px;background:#b42318;color:#ffffff">
            <p style="margin:0 0 6px;font-size:13px;font-weight:bold;text-transform:uppercase">Qauntum Secure Guard</p>
            <h1 style="margin:0;font-size:24px">Deposit needs attention</h1>
          </header>
          <section style="padding:28px 24px">
            <p style="margin:0 0 16px">Hello ${safeName},</p>
            <p style="margin:0 0 20px">We could not approve the deposit below. No funds have been credited for this request. Please contact support if you believe this decision was made in error or need help submitting a new request.</p>
            <table role="presentation" style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb">
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Amount</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${formattedAmount} ${safeCoin}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Network</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right">${networkLabel}</td></tr>
              <tr><td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280">Estimated value</td><td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right">${formattedUsdValue}</td></tr>
              <tr><td style="padding:12px;color:#6b7280">Request ID</td><td style="padding:12px;text-align:right;font-family:monospace">${safeDepositId}</td></tr>
            </table>
          </section>
          ${getFooter()}
        </main>
      </body>
    </html>
  `;
}