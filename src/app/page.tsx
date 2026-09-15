"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, Shield, Lock, TrendingUp, Bolt, DollarSign, KeySquareIcon, ShieldCheck, Cloud, UserPlus, ShieldHalfIcon, BarChart, Smartphone, Zap, Verified, Star } from "lucide-react"
import { faqs, patner } from "@/constants"
import { Button } from "@/components/ui/button"

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden hero-section">
        <div className="absolute inset-0 pointer-events-none hero-section-overlay" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full mb-8 border border-cyan-900/50 bg-cyan-900/40">
            <span className="inline-block bg-cyan-400 rounded-full animate-pulse">
              <Verified size={12} />
            </span>
            <span className="text-sm font-semibold text-cyan-300">Qauntum Secure Guard</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            The Qauntum Secure Guard Platform
          </h1>
          <p className="text-xl md:text-2xl text-cyan-300 mb-6 font-semibold">
            Unlock Access to Advanced, Intelligent, and Next-Generation Digital Asset Solutions
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Qauntum Secure Guard features a fortified encrypted ledger powered by quantum-grade security measures, designed to shield your holdings against cyber threats, market volatility, and infrastructure disruptions. Your asset integrity remains uncompromised and protected from any breach.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register">
              <button className="px-8 py-4 bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all text-lg">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border-2 border-cyan-900/50 text-white font-bold rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-all">
                Login Now
              </button>
            </Link>
          </div>

          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Shield size={16} className="text-cyan-400" />
              SOC 2 Certified
            </div>
            <div className="flex items-center gap-1">
              <Lock size={16} className="text-cyan-400" />
              256-bit Encryption
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={16} className="text-cyan-400" />
              GDPR Compliant
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-bg border-b border-cyan-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center stat-counter">
              <div className="text-4xl md:text-5xl font-black text-gradient mb-2">$500M+</div>
              <div className="text-gray-400 font-medium">Assets Refined</div>
            </div>
            <div className="text-center stat-counter">
              <div className="text-4xl md:text-5xl font-black text-gradient mb-2">120K+</div>
              <div className="text-gray-400 font-medium">Active Wallets</div>
            </div>
            <div className="text-center stat-counter">
              <div className="text-4xl md:text-5xl font-black text-gradient mb-2">0.01s</div>
              <div className="text-gray-400 font-medium">Latency</div>
            </div>
            <div className="text-center stat-counter">
              <div className="text-4xl md:text-5xl font-black text-gradient mb-2">24/7</div>
              <div className="text-gray-400 font-medium">Live Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-linear-to-b from-dark-bg to-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Advanced Quantum Capabilities
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Harnessing quantum technology to enable rapid, seamless financial operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-2xl p-8 border border-cyan-900/40 hover:shadow-cyan-500/40 card-hover bg-slate-800/60">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-cyan-900/40">
                <span className="material-symbols-outlined text-cyan-400 text-3xl">
                  <KeySquareIcon />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Secure Wallet</h3>
              <p className="text-gray-400 leading-relaxed">
                Qauntum Secure Guard's Protected Vault maintains your digital holdings in absolute safety through military-grade protection and layered security protocols, ensuring your investments remain secure from unauthorized breaches. Experience complete peace of mind with our fortress-level security architecture.
              </p>
            </div>

            <div className="rounded-2xl p-8 border border-cyan-900/40 hover:shadow-cyan-500/40 card-hover bg-slate-800/60">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-amber-900/40">
                <span className="material-symbols-outlined text-gold text-3xl">
                  <DollarSign />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Multi Currency</h3>
              <p className="text-gray-400 leading-relaxed">
                Our Multi-Asset Hub enables unified management of diverse currencies and digital tokens across a single integrated platform, simplifying your portfolio without the complications of separate systems. Seamlessly manage everything in one secure location.
              </p>
            </div>

            <div className="rounded-2xl p-8 border border-cyan-900/40 hover:shadow-cyan-500/40 card-hover bg-slate-800/60">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-cyan-900/40">
                <span className="material-symbols-outlined text-cyan-400 text-3xl">
                  <Bolt />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Transactions</h3>
              <p className="text-gray-400 leading-relaxed">
                Transfer and acquire holdings immediately using Qauntum Secure Guard's rapid settlement system—no delays, just dependable speed and security whenever required. Experience lightning-fast transactions you can rely on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Enterprise-Grade Quantum Protection
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced quantum-powered defenses safeguard your portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-2xl p-8 text-center security-badge border border-cyan-900/40 hover:shadow-cyan-500/40 bg-slate-800/60">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-cyan-900/40">
                <span className="material-symbols-outlined text-cyan-400 text-4xl">
                  <ShieldCheck />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2FA Authentication</h3>
              <p className="text-sm text-gray-400">Dual-verification security on Qauntum Secure Guard provides reinforced access controls through advanced two-step validation protocols. This layered approach ensures comprehensive protection against unauthorized entry, fraud attempts, and security breaches, keeping your holdings completely secure.</p>
            </div>

            <div className="rounded-2xl p-8 text-center security-badge border hover:shadow-cyan-500/40"
              style={{ background: "rgba(26, 41, 66, 0.6); border-color: rgba(0, 212, 255, 0.1)" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(212, 175, 55, 0.1)" }}>
                <span className="material-symbols-outlined text-gold text-4xl">
                  <Lock />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quantum Encryption</h3>
              <p className="text-sm text-gray-400">Benefit from cutting-edge quantum-grade cryptographic defense architecture that provides unparalleled protection for your holdings. This advanced security framework withstands sophisticated threats and ensures your data remains protected against evolving cyber dangers.</p>
            </div>

            <div className="rounded-2xl p-8 text-center security-badge border border-cyan-900/40 hover:shadow-cyan-500/40 bg-slate-800/60">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-cyan-900/40">
                <span className="material-symbols-outlined text-cyan-400 text-4xl">
                  <Cloud />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cold Storage</h3>
              <p className="text-sm text-gray-400">Offline-vault storage solutions through Qauntum Secure Guard maintain maximum protection by keeping your holdings completely disconnected from online networks. This isolated approach eliminates exposure to digital threats while ensuring long-term preservation and security.</p>
            </div>

            <div className="rounded-2xl p-8 text-center security-badge border border-cyan-900/40 hover:shadow-cyan-500/40 bg-slate-800/60">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-amber-900/40">
                <span className="material-symbols-outlined text-amber-500 text-4xl">
                  <ShieldCheck />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Insurance Protected</h3>
              <p className="text-sm text-gray-400">Holdings maintained on Qauntum Secure Guard benefit from insurance-backed security protocols that provide additional safeguards for your assets. This comprehensive protection framework ensures your digital portfolio maintains maximum security and peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-linear-to-b from-dark-bg to-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Begin optimizing your holdings through a straightforward four-phase process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="step-number mb-4 text-dark-bg font-bold">
                  <span>1</span>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0, 212, 255, 0.1)" }}>
                  <span className="material-symbols-outlined text-cyan-400 text-4xl">
                    <UserPlus />
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Account</h3>
              <p className="text-gray-400 leading-relaxed">
                Register quickly using minimal information. Fast and straightforward setup process.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="step-number mb-4 text-dark-bg font-bold">
                  <span>2</span>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(212, 175, 55, 0.1)" }}>
                  <span className="material-symbols-outlined text-gold text-4xl">
                    <ShieldHalfIcon />
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Wallet</h3>
              <p className="text-gray-400 leading-relaxed">
                Configure dual-factor protection and fortify your digital holdings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="step-number mb-4 text-dark-bg font-bold">
                  <span>3</span>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0, 212, 255, 0.1)" }}>
                  <span className="material-symbols-outlined text-cyan-400 text-4xl">
                    <DollarSign />
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Refine Assets</h3>
              <p className="text-gray-400 leading-relaxed">
                Fund your account and start optimizing your valuable holdings.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="step-number mb-4 text-dark-bg font-bold">
                  <span>4</span>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(212, 175, 55, 0.1)" }}>
                  <span className="material-symbols-outlined text-gold text-4xl">
                    <TrendingUp />
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Watch Growth</h3>
              <p className="text-gray-400 leading-relaxed">
                Track your investments through live performance metrics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Platform Section */}
      <section id="platform" className="py-24 bg-dark-bg border-t border-cyan-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Quantum Platform
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience institutional-grade trading and quantum portfolio management
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Main Dashboard Preview */}
            <div className="screenshot-hover rounded-2xl overflow-hidden shadow-2xl border border-cyan-900/40 shadow-cyan-900/40">
              <Image src="/images/platform_showcase_1.jpg" alt="Dashboard Analytics" width={600} height={400}
                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" />
              <div className="screenshot-label">
                <span className="px-6 py-3 rounded-full font-bold text-gray-900 shadow-xl bg-cyan-400 shadow-cyan-500/40">
                  Quantum Analytics Dashboard
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-16">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-cyan-900/40">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">
                    <Zap />
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-Time Quantum Data</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Lightning-fast updates with millisecond-precision market data from global
                    exchanges via quantum links.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-900/40">
                  <span className="material-symbols-outlined text-amber-500 text-2xl">
                    <BarChart />
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Professional charting tools, technical indicators, and AI-powered insights.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-cyan-900/40">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">
                    <Smartphone />
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Mobile Trading</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Trade on-the-go with our native mobile apps for iOS and Android.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Additional Feature Screenshots */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="screenshot-hover rounded-xl overflow-hidden shadow-lg border border-cyan-900/40">
              <Image src="/images/platform_showcase_2.jpg" alt="Secure Wallet" width={300} height={256}
                className="w-full h-64 object-cover opacity-80 hover:opacity-100 transition-opacity" />
              <div className="screenshot-label">
                <span className="px-4 py-2 rounded-full font-bold text-sm text-gray-900 shadow-xl bg-cyan-400 text-nowrap">
                  Secure Wallet
                </span>
              </div>
            </div>

            <div className="screenshot-hover rounded-xl overflow-hidden shadow-lg border border-cyan-900/40">
              <Image src="/images/ledger-main.png" alt="Transaction History" width={300} height={256}
                className="w-full h-64 object-cover opacity-80 hover:opacity-100 transition-opacity" />
              <div className="screenshot-label">
                <span className="px-4 py-2 rounded-full font-bold text-sm text-gray-900 shadow-xl bg-amber-500 text-nowrap">
                  Transaction History
                </span>
              </div>
            </div>

            <div className="screenshot-hover rounded-xl overflow-hidden shadow-lg border border-cyan-900/40">
              <Image src="/images/ledge3.jpg" alt="Portfolio Management" width={300} height={256}
                className="w-full h-64 object-cover opacity-80 hover:opacity-100 transition-opacity" />
              <div className="screenshot-label">
                <span className="px-4 py-2 rounded-full font-bold text-sm text-gray-900 shadow-xl bg-cyan-400 text-nowrap">
                  Portfolio Management
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Platform Section */}
      <section id="platform" className="py-24 bg-dark-bg border-t border-cyan-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Precious Metals Investment
            </h2>
            <p className="text-xl text-gray-400">
              Invest And Backup Your Precious Metals With Qauntum Secure Guard For Maximum Security And Earn Up To 15% profits weekly
            </p>
          </div>

          <Image
            src="/images/metals.jpeg"
            alt="Precious Metals Investment"
            width={1200}
            height={600}
            className="w-full h-auto rounded-2xl shadow-2xl border border-cyan-900/40 shadow-cyan-900/40 mb-12"
          />

          <Button
            asChild
            className="flex justify-center items-center"
          >
            <Link
              href="/register" 
              className="w-1/2 mx-auto bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all text-lg px-8 py-4"
            >
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-linear-to-b from-dark-card to-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Trusted by Leaders
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied clients worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl p-8 border hover:shadow-cyan-500/40 card-hover"
              style={{ background: "rgba(10, 22, 40, 0.6); border-color: rgba(0, 212, 255, 0.1)" }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="material-symbols-outlined text-gold">
                    <Star />
                  </span>
                ))}
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                "The security and ease of use are unmatched. Qauntum Secure Guard has transformed how we
                manage our digital assets."
              </p>
              <div className="flex items-center gap-3">
                <Image src="https://i.pravatar.cc/450?img=12" alt="Michael Chen"
                  className="w-12 h-12 rounded-full border-2 border-cyan-500/30" width={50} height={50} />
                <div>
                  <div className="font-bold text-white">Michael Chen</div>
                  <div className="text-sm text-cyan-400">CEO, TechVentures</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-8 border hover:shadow-cyan-500/40 card-hover"
              style={{ background: "rgba(10, 22, 40, 0.6); border-color: rgba(0, 212, 255, 0.1)" }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="material-symbols-outlined text-gold">
                    <Star />
                  </span>
                ))}
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                "Professional service with exceptional support. Their asset recovery team helped us
                retrieve significant holdings."
              </p>
              <div className="flex items-center gap-3">
                <Image src="https://i.pravatar.cc/450?img=47" alt="Sarah Martinez"
                  className="w-12 h-12 rounded-full border-2 border-cyan-500/30" width={50} height={50} />
                <div>
                  <div className="font-bold text-white">Sarah Martinez</div>
                  <div className="text-sm text-cyan-400">Investor</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-8 border hover:shadow-cyan-500/40 card-hover"
              style={{ background: "rgba(10, 22, 40, 0.6); border-color: rgba(0, 212, 255, 0.1)" }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="material-symbols-outlined text-gold">
                    <Star />
                  </span>
                ))}
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                "Best platform for institutional investors. The analytics and reporting tools are second
                to none."
              </p>
              <div className="flex items-center gap-3">
                <Image src="https://i.pravatar.cc/450?img=33" alt="David Thompson"
                  className="w-12 h-12 rounded-full border-2 border-cyan-500/30" width={50} height={50} />
                <div>
                  <div className="font-bold text-white">David Thompson</div>
                  <div className="text-sm text-cyan-400">Fund Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-24 bg-dark-bg border-t border-cyan-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Our Partners
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Trusted by leading cryptocurrency platforms and exchanges worldwide
            </p>
          </div>

          <div className="space-y-8">
            {/* First row - sliding left */}
            <div className="partners-slider">
              <div className="partners-track">
                {/* First set of logos */}
                {patner.map((item, index) => (
                  <img key={index} src={item.image} alt={item.name} className="partner-logo" />
                ))}

                {/* Second set */}
                {patner.map((item, index) => (
                  <img key={index} src={item.image} alt={item.name} className="partner-logo" />
                ))}

                {/* Third set */}
                {patner.map((item, index) => (
                  <img key={index} src={item.image} alt={item.name} className="partner-logo" />
                ))}
              </div>
            </div>

            {/* Second row - sliding right */}
            <div className="partners-slider">
              <div className="partners-track-reverse">
                {/* First set of logos */}
                {patner.map((item, index) => (
                  <img key={index} src={item.image} alt={item.name} className="partner-logo" />
                ))}

                {/* Second set */}
                {patner.map((item, index) => (
                  <img key={index} src={item.image} alt={item.name} className="partner-logo" />
                ))}

                {/* Third set */}
                {patner.map((item, index) => (
                  <img key={index} src={item.image} alt={item.name} className="partner-logo" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Find answers to common questions about our platform</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-900/50 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-lg hover:bg-slate-700/50 transition-colors"
                >
                  {faq.question}
                  <ChevronDown size={20} className={`transform transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-slate-700 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <button className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent to-cyan-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Secure Your Digital Future?</h2>
          <p className="text-xl text-gray-400 mb-12">Join 120,000+ users managing over $500M in digital assets</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="px-8 py-4 bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all text-lg">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border-2 border-cyan-900/50 text-white font-bold rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-all">
                Login Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <Image 
                  src="/images/logo.png"
                  alt="logo"
                  width={80}
                  height={80}
                />
                <span>Qauntum Secure Guard</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                State-of-the-art digital refining platform for secure, efficient, and user-friendly asset management.
              </p>
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-3">Regulatory Bodies</h4>
                <div className="flex gap-3">
                  <div className="bg-slate-700 rounded flex items-center justify-center text-xs font-bold px-2 py-1">SEC</div>
                  <div className="bg-slate-700 rounded flex items-center justify-center text-xs font-bold px-2 py-1">FinCEN</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Secure Wallet</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Asset Refining</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Quantum Exchange</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© Qauntum Secure Guard. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-linear-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-slate-950 hover:shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all z-40 animate-bounce"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  )
}

export default Home