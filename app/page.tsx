'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CircleDollarSign,
  Vote,
  ArrowRight,
  Wallet,
  Activity,
  Shield,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

// --- Visual Background: Premium Grid ---
const PremiumBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25]" />
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full"
    />
    <motion.div
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 12, repeat: Infinity, delay: 2 }}
      className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 blur-[130px] rounded-full"
    />
  </div>
);

const Navbar = () => {
  const { accountAddress, isConnected } = useWallet();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (accountAddress && isConnected) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: accountAddress }),
          });
          const data = await res.json();
          if (res.ok && data.user) setUserRole(data.user.role);
        } catch (err) {
          console.error(err);
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, [accountAddress, isConnected]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-3 bg-white/80 backdrop-blur-md border-b border-border shadow-sm' : 'py-6 bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-black text-white w-9 h-9 flex items-center justify-center font-bold text-xl rounded-xl shadow-lg rotate-[-8deg] group-hover:rotate-0 transition-all duration-300">
            X
          </div>
          <span className="font-bold text-2xl tracking-tight text-text-primary">TrustFundX</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/how-it-works" className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">How It Works</Link>
          <Link href="/sponsors-info" className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">Sponsors</Link>
          <Link href="/governance" className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">Governance</Link>
          <Link href="/faqs" className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">FAQs</Link>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && userRole ? (
            <Link href={`/${userRole}s`}>
              <button className="flex items-center gap-2 bg-black text-white text-[15px] font-bold px-6 py-2.5 rounded-full hover:bg-black/90 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                <Activity size={18} strokeWidth={2.5} />
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[15px] font-bold text-text-primary hover:text-primary transition-colors px-4">Log in</Link>
              <Link href="/signup">
                <button className="bg-primary text-white text-[15px] font-bold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group relative p-8 bg-white border border-border rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
      <Icon size={28} className="text-white" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed text-[15px]">{desc}</p>
    <div className="mt-6 flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Learn more <ArrowRight size={16} className="ml-1" />
    </div>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/10">
      <PremiumBackground />
      <Navbar />

      <main className="relative z-10">
        {/* --- Hero Section --- */}
        <section className="pt-44 pb-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 border border-black/10 rounded-full text-black font-bold text-xs uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Empowering Next-Gen Students on Algorand
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-text-primary tracking-tight leading-[0.95] mb-8 text-balance"
          >
            Programmable <br /> Trust for Grants
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
          >
            The world's most transparent grant management protocol. Automate funding releases through on-chain milestones and community governance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto bg-primary text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all">
              Initialize Protocol
            </button>
            <button className="w-full sm:w-auto bg-white border border-border text-text-primary font-bold text-lg px-10 py-4 rounded-full shadow-premium hover:bg-background transition-all">
              View Governance
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 pt-10 border-t border-border flex flex-col items-center gap-8"
          >
            <span className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">POWERING DECENTRALIZED INNOVATION</span>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-2xl font-bold">ALGORAND</div>
              <div className="flex items-center gap-2 text-2xl font-bold">PERA WALLET</div>
              <div className="flex items-center gap-2 text-2xl font-bold">DAO NODE</div>
            </div>
          </motion.div>
        </section>

        {/* --- Core Features --- */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-text-primary tracking-tight mb-4">Architected for Transparency</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Every transaction, vote, and milestone is permanently recorded and cryptographically verified.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              color="bg-primary"
              title="Immutable Escrow"
              desc="Funds are locked in autonomous smart contracts, releasing only when cryptographic proof of completion is validated."
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              color="bg-secondary"
              title="DAO Governance"
              desc="Independent voters act as objective validators, ensuring institutional integrity without sponsor-bias."
              delay={0.2}
            />
            <FeatureCard
              icon={Zap}
              color="bg-accent"
              title="Instant Latency"
              desc="Built on Algorand's high-speed protocol for near-instant fund release and zero-trust transactions."
              delay={0.3}
            />
          </div>
        </section>

        {/* --- Infrastructure Section --- */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-text-primary rounded-[32px] p-12 md:p-24 overflow-hidden relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.15),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
                  Programmable Incentives. <br /> Guaranteed Impact.
                </h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  Traditional grants are broken. TrustFundX provides a unified infrastructure for sponsors to fund talent with 100% confidence. No manual verification, no delays, no ambiguity.
                </p>

                <div className="space-y-6">
                  {[
                    { title: "Sovereign Authentication", desc: "No passwords. Pure wallet-based identity via Pera." },
                    { title: "TEAL Smart Contracts", desc: "Execution-layer security on the Algorand virtual machine." },
                    { title: "Real-time Audits", desc: "Publicly visible ledger for every ALGO movement." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckIcon className="text-primary" size={14} strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{item.title}</h4>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary to-secondary/20 rounded-3xl rotate-[6deg] group-hover:rotate-[3deg] transition-transform duration-700 shadow-2xl relative z-10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe size={180} className="text-white/20 animate-pulse" strokeWidth={0.5} />
                  </div>
                </div>
                <div className="absolute inset-0 border border-white/10 rounded-3xl -rotate-[6deg] group-hover:-rotate-[3deg] transition-transform duration-700" />
              </div>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-20 px-6 max-w-7xl mx-auto border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary text-white w-8 h-8 flex items-center justify-center font-bold text-lg rounded-lg shadow-lg">X</div>
                <span className="font-bold text-xl tracking-tighter">TrustFundX</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                The definitive infrastructure for decentralized grant management. Built for transparency, governed by community.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-primary">Protocol</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="hover:text-primary transition-colors cursor-pointer">Security Audit</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Technical Spec</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Governance</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-primary">Social</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="hover:text-primary transition-colors cursor-pointer">X / Twitter</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Discord</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Github</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-text-primary">Legal</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-border flex justify-between items-center text-xs font-bold text-text-secondary tracking-widest uppercase">
            <span>© 2024 TrustFundX Autonomous Protocol</span>
            <span>DEPLOYED ON ALGORAND TESTNET</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

const CheckIcon = ({ className, size, strokeWidth }: any) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
