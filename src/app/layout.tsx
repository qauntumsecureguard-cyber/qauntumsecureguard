import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeHeader from "@/components/home-header";
import { FaWhatsapp } from "react-icons/fa";
// import SmartsuppClient from "@/components/chat/smartsupp-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Qauntum Secure Guard",
  description: "Financial Qauntum Secure Guard Trading & Asset Security Platform",
  manifest: "/manifest.json"
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <HomeHeader user={session?.user} />
        {children}

        <Toaster position="top-right" />
        {/* Floating WhatsApp Action Button */}
        <a
          href="https://wa.me/16038157315"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 ring-4 ring-emerald-500/20 hover:scale-110 hover:bg-[#20ba5a] active:scale-95 md:bottom-6 md:right-6"
        >
          <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
        </a>
        {/* <SmartsuppClient /> */}
      </body>
    </html>
  );
}