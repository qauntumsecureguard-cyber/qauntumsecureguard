"use client";

import React, { useState } from "react";
import { Copy, Check, X, Headphones, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  amount?: number | string;
  coin?: string;
  recipientAddress?: string;
  title?: string;
  description?: string;
}

export default function ContactSupportModal({
  isOpen,
  onClose,
  txHash,
  amount,
  coin,
  recipientAddress,
  title = "Contact 24/7 Support",
  description = "Choose your preferred channel below to reach our dedicated support desk.",
}: ContactSupportModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const emailAddress = "qauntumsecureguard@gmail.com";
  const whatsappNumber = "16038157315"; // +1 (603) 815-7315
  const telegramHandle = "qfs_secureguard_portal";

  // Build subject and body
  const emailSubject = txHash
    ? `Withdrawal Verification - Hash: ${txHash}`
    : "Support Request - Quantum Secure Guard";

  const emailBody = txHash
    ? `Hello Quantum Secure Guard Support,\n\nI need assistance verifying my withdrawal request.\n\nTransaction Details:\n- Transaction Hash: ${txHash}${
        amount && coin ? `\n- Amount: ${amount} ${coin}` : ""
      }${
        recipientAddress ? `\n- Recipient Address: ${recipientAddress}` : ""
      }\n\nPlease help me finalize this request.\n\nThank you!`
    : `Hello Quantum Secure Guard Support,\n\nI need assistance with my account.\n\nThank you!`;

  const whatsappMessage = txHash
    ? `Hello Quantum Secure Guard Support, I need assistance verifying my withdrawal.\n\nTransaction Hash: ${txHash}${
        amount && coin ? `\nAmount: ${amount} ${coin}` : ""
      }${recipientAddress ? `\nRecipient: ${recipientAddress}` : ""}`
    : `Hello Quantum Secure Guard Support, I need assistance with my account.`;

  // Direct Gmail web compose link
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    emailAddress
  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    emailBody
  )}`;

  // Default mailto fallback
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  // Telegram link
  const telegramUrl = `https://t.me/${telegramHandle}`;

  // WhatsApp link
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleCopyHash = async () => {
    if (!txHash) return;
    try {
      await navigator.clipboard.writeText(txHash);
      setCopiedHash(true);
      toast.success("Transaction Hash copied to clipboard!");
      setTimeout(() => setCopiedHash(false), 2500);
    } catch {
      toast.error("Failed to copy hash");
    }
  };

  const handleOpenGmail = () => {
    if (txHash) {
      navigator.clipboard?.writeText(txHash).catch(() => {});
    }
    // Try opening Gmail in a new tab; fallback to mailto if popup blocked
    const newWindow = window.open(gmailUrl, "_blank");
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      window.location.href = mailtoUrl;
    }
    toast.success("Opening Gmail compose...");
  };

  const handleOpenTelegram = () => {
    if (txHash) {
      navigator.clipboard?.writeText(txHash).catch(() => {});
      toast.info("Transaction Hash copied! Paste it in the Telegram chat.");
    }
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenWhatsapp = () => {
    if (txHash) {
      navigator.clipboard?.writeText(txHash).catch(() => {});
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp chat...");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Transaction Hash preview box if provided */}
        {txHash && (
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transaction Hash
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-amber-500 dark:text-amber-400 break-all select-all bg-white dark:bg-gray-950 p-2 rounded-lg border border-gray-200 dark:border-white/5">
              {txHash}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              💡 Hash is automatically included in Gmail and WhatsApp messages.
            </p>
          </div>
        )}

        {/* Channel Selection Buttons */}
        <div className="space-y-2.5">
          {/* 1. Open with Gmail */}
          <button
            type="button"
            onClick={handleOpenGmail}
            className="w-full group p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-red-500/5 dark:hover:bg-red-500/10 hover:border-red-500/40 transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {/* Gmail Icon */}
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                    fill="#EA4335"
                    fillOpacity="0.15"
                  />
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6L12 13L22 6C22 4.9 21.1 4 20 4Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M2 6V18C2 19.1 2.9 20 4 20H6V10L2 6Z"
                    fill="#C5221F"
                  />
                  <path
                    d="M22 6V18C22 19.1 21.1 20 20 20H18V10L22 6Z"
                    fill="#C5221F"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
                  Open with Gmail
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {emailAddress}
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>

          {/* 2. Open with Telegram */}
          <button
            type="button"
            onClick={handleOpenTelegram}
            className="w-full group p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-sky-500/5 dark:hover:bg-sky-500/10 hover:border-sky-500/40 transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {/* Telegram Icon */}
                <svg
                  className="w-5 h-5 text-[#229ED9]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-sky-500 transition-colors">
                  Open with Telegram
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  @{telegramHandle}
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition-colors" />
          </button>

          {/* 3. Open with WhatsApp */}
          <button
            type="button"
            onClick={handleOpenWhatsapp}
            className="w-full group p-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {/* WhatsApp Icon */}
                <svg
                  className="w-5 h-5 text-[#25D366]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.65L5.27 16.62L5.07 16.31C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.83C8.94 6.83 8.67 6.89 8.44 7.14C8.21 7.39 7.56 8 7.56 9.22C7.56 10.44 8.45 11.62 8.57 11.78C8.7 11.95 10.31 14.43 12.78 15.5C13.37 15.75 13.82 15.9 14.18 16.02C14.77 16.2 15.31 16.18 15.73 16.11C16.21 16.04 17.19 15.52 17.4 14.94C17.61 14.36 17.61 13.86 17.55 13.76C17.48 13.66 17.34 13.6 17.13 13.5C16.92 13.4 15.89 12.89 15.7 12.82C15.51 12.75 15.37 12.72 15.23 12.93C15.09 13.14 14.69 13.61 14.57 13.75C14.45 13.89 14.33 13.91 14.12 13.8C13.91 13.7 13.02 13.41 11.97 12.47C11.15 11.74 10.6 10.84 10.44 10.57C10.28 10.3 10.42 10.15 10.53 10.04C10.62 9.94 10.74 9.78 10.85 9.65C10.95 9.51 10.99 9.42 11.06 9.28C11.13 9.14 11.09 9.01 11.04 8.91C10.99 8.81 10.57 7.78 10.39 7.37C10.22 6.96 10.05 7.02 9.91 7.01C9.79 7 9.65 6.99 9.51 6.99C9.37 6.99 9.25 6.83 9.11 6.83Z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  Open with WhatsApp
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +1 (603) 815-7315
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>

        {/* Footer info / Cancel */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
