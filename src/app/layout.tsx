import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeHeader from "@/components/home-header";
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HomeHeader user={session?.user} />
          {children}

          <Toaster position="top-right" />
          {/* <SmartsuppClient /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}