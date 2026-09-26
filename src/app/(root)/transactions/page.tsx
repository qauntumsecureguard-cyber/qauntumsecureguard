import { getUserTransactionsBoard } from "@/actions/transactions.action";
import TransactionsClient from "@/components/clients/transactions-client";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const { transactions } = await getUserTransactionsBoard();
  return <TransactionsClient transactions={transactions} />;
}