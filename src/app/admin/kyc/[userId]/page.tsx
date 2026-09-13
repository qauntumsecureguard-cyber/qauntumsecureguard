import KycClientButton from "@/components/admin/KycClientButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth, User as UserType } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ userId: string }> }

async function KycAdmin({ params }: Props) {
  try {
    const userId = (await params).userId;

    const userInfo = await auth.api.getUser({
      query: { id: userId },
      headers: await headers()
    }) as UserType

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
      kyc: userInfo.kyc
    };

    return (
      <section className="max-w-5xl mx-auto pb-20">
        <div className="space-y-8 overflow-y-auto">
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

          <div
            className="w-full h-auto md:w-[500px]"
          >
            <Image
              src={user.kyc?.image || ""}
              alt=""
              width={500}
              height={500}
              className="w-full h-auto"
            />
          </div>

          <KycClientButton kyc={user.kyc as { status: string, image: string, type: string }} userId={user.userId} />
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

export default KycAdmin;