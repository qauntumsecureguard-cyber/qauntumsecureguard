"use client";

import { User } from "@/lib/auth"
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react"

function HomeHeader({ user }: { user: User | undefined }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/30 border-b border-cyan-900/30", !isHome && "hidden")}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
            <Image 
              src="/images/logo.png"
              alt="logo"
              width={80}
              height={80}
            />
          <span>Qauntum Secure Guard</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
          <a href="#security" className="text-gray-300 hover:text-cyan-400 transition-colors">Security</a>
          <a href="#faq" className="text-gray-300 hover:text-cyan-400 transition-colors">About</a>
          <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user
            ? (
              <Link href="/dashboard">
                <Image
                  src="/images/default.png"
                  alt="profile"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-6 py-2 text-gray-300 hover:text-white transition-colors">Log In</button>
                </Link>
                <Link href="/register">
                  <button className="px-6 py-2 bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all">Get Started</button>
                </Link>
              </>
            )}
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-cyan-900/30 p-4 space-y-2">
          <a
            href="#features"
            className="block px-4 py-2 text-gray-300 hover:text-cyan-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#security"
            className="block px-4 py-2 text-gray-300 hover:text-cyan-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            Security
          </a>
          <a
            href="#faq"
            className="block px-4 py-2 text-gray-300 hover:text-cyan-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          {user
            ? (
              <Link
                href="/dashboard"
                className="block px-4 py-2 bg-cyan-500 text-slate-950 rounded-lg font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2">Log In</Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-cyan-500 text-slate-950 rounded-lg font-bold"
                >
                  Get Started
                </Link>
              </>
            )}
        </div>
      )}
    </header>
  )
}

export default HomeHeader