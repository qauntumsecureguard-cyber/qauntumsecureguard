import AdminHeader from "@/components/admin/Header";
import AdminSidebar from "@/components/admin/Sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react"

async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader userName={session.user.name} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="p-3 sm:p-4 md:p-6 md:pl-64 pt-20 flex-1 min-w-0 w-full overflow-x-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout