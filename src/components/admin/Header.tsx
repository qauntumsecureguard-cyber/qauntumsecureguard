import Image from "next/image";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";

async function AdminHeader({ userName }: { userName: string }) {

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-2 sm:px-6 py-4 border-b bg-black z-100">
      <span className="font-semibold text-sm sm:text-lg text-white capitalized">
        Welcome 👋 {userName}
      </span>

      <div className="flex items-center gap-1">
        <MobileSidebar />

        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/default.png"
            alt="Admin Avatar"
            width={36}
            height={36}
            className="rounded-full border"
          />
        </Link>
      </div>
    </header>
  );
}

export default AdminHeader;