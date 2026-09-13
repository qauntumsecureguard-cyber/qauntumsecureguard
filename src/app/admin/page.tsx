export const dynamic = "force-dynamic";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { AlertCircle, AlertOctagon, CheckCircle2, Globe, MapPin } from "lucide-react"
import { auth, User } from "@/lib/auth";
import { headers } from "next/headers";
import ActionsCell from "@/components/admin/ActionsCell";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import UserRoleCell from "@/components/admin/UserRoleCell";
import mongoose from "mongoose";

async function AdminPanel() {
  try {
    const [session, listOfUsers] = await Promise.all([
      auth.api.getSession({
        headers: await headers()
      }),
      auth.api.listUsers({
        query: {},
        headers: await headers()
      })
    ])

    if (!session) redirect("/login")

    const users = listOfUsers.users as User[];

    const ipByUserId = new Map<string, string>();
    try {
      const db = mongoose.connection.db;
      if (db) {
        const sessions = await db.collection("session").find({}).sort({ expiresAt: -1 }).toArray();
        for (const s of sessions) {
          if (s.userId && s.ipAddress && !ipByUserId.has(s.userId.toString())) {
            ipByUserId.set(s.userId.toString(), s.ipAddress);
          }
        }
      }
    } catch {
      // ignore
    }

    return (
      <div className="max-w-6xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location & IP</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Kyc</TableHead>
              <TableHead>Connected Wallet</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex flex-col gap-2">
                  <span>
                    {user.name}
                  </span>
                  <span>
                    {user.email}
                  </span>
                  <span className="flex gap-2">
                    {user.banned && (
                      <Badge variant="destructive">
                        Banned
                      </Badge>
                    )}

                    <Badge
                      variant={user.emailVerified ? "default" : "outline"}
                      className={
                        user.emailVerified
                          ? "bg-green-500 hover:bg-green-600 text-white border-green-600"
                          : "border-amber-500 text-amber-700 bg-amber-50"
                      }
                    >
                      {user.emailVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Verified
                        </>
                      )}
                    </Badge>
                  </span>
                </TableCell>
                <TableCell>
                  <UserRoleCell userId={user.id} userRole={user.role as "user" | "admin"} />
                </TableCell>
                <TableCell>
                  {(() => {
                    const ip = (user as any).ipAddress || ipByUserId.get(user.id) || "";
                    const country = (user as any).country || "";
                    if (!ip && !country) {
                      return <span className="text-gray-400 text-xs">Unknown</span>;
                    }
                    return (
                      <div className="flex flex-col gap-1">
                        {country ? (
                          <span className="flex items-center gap-1.5 font-medium text-xs text-gray-900 dark:text-gray-100">
                            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{country}</span>
                          </span>
                        ) : null}
                        {ip ? (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{ip}</span>
                          </span>
                        ) : null}
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {user.walletStatus === "connected" ? (
                    <span className="text-gray-400 flex gap-1 justify-start items-center">
                      <CheckCircle2 color="green" className="w-3 h-3" />
                      Connected
                    </span>
                  ) : user.walletStatus === "pending"
                    ? (
                      <span className="text-gray-400 flex gap-1 justify-start items-center">
                        <AlertCircle color="blue" className="w-3 h-3" />
                        Pending
                      </span>
                    ) : (
                      <span className="text-gray-400 flex gap-1 justify-start items-center">
                        <AlertCircle color="red" className="w-3 h-3" />
                        Not Connected
                      </span>

                    )
                  }
                </TableCell>
                <TableCell>
                  {user.kyc.status !== "none" ? (
                    <Link
                      href={`/admin/kyc/${user.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  ) : "N/A"}
                </TableCell>
                <TableCell>
                  {user.walletStatus === "not-connected" ? (
                    <span className="text-gray-400">N\A</span>
                  ) : (
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      View Wallet
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  {user.id !== session.user.id
                    ? (
                      <ActionsCell userId={user.id} userBanned={user.banned} />
                    ) : (
                      <Badge>
                        You
                      </Badge>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } catch {
    return (
      <div className="max-w-5xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Connected Wallet</TableHead>
              <TableHead>View Connected Wallet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center text-red-700 py-6">
                <div className="flex justify-center items-center gap-1">
                  <AlertOctagon color="red" size={15} /> An error occurred while loading data. Please refresh the page.
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default AdminPanel;