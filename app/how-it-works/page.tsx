'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  FileText,
  Vote,
  CheckCircle,
  ArrowRight,
  CircleDollarSign,
  Users,
  Shield,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Navbar = () => {
  const { accountAddress, isConnected } = useWallet();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (accountAddress && isConnected) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: accountAddress }),
          });
          const data = await res.json();
          if (res.ok && data.user) {
            setUserRole(data.user.role);
          }
        } catch (err) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, [accountAddress, isConnected]);

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-transparent sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-black text-white w-7 h-7 flex items-center justify-center font-bold text-lg rounded-sm transform -rotate-6">
            X
          </div>
          <span className="font-semibold text-2xl tracking-tight text-black ml-2 -mt-1">TrustFundX</span>
        </Link>
        <div className="h-8 w-[1px] bg-gray-300 mx-2" />
        <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-800">
          <Link href="/how-it-works" className="text-blue-600 transition-colors">How It Works</Link>
          <Link href="/sponsors-info" className="hover:text-black transition-colors">Sponsors</Link>
          <Link href="/governance" className="hover:text-black transition-colors">Governance</Link>
          <Link href="/faqs" className="hover:text-black transition-colors">FAQs</Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isConnected && userRole ? (
          <Link href={`/${userRole}s`}>
            <button className="flex items-center gap-2 bg-[#214A9D] text-white text-[15px] font-medium px-5 py-2 rounded-lg hover:bg-[#1A3B81] transition-all shadow-md">
              <Activity size={18} strokeWidth={2} />
              Dashboard
            </button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <button className="text-[15px] font-medium px-5 py-2 border border-gray-200 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all text-gray-800">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="flex items-center gap-2 bg-[#214A9D] text-white text-[15px] font-medium px-5 py-2 rounded-lg hover:bg-[#1A3B81] transition-all shadow-md">
                <Wallet size={18} strokeWidth={2} />
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const StepCard = ({ number, title, desc, icon: Icon, delay }: { number: number, title: string, desc: string, icon: any, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.1 }}
    whileHover={{ y: -5 }}
    className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group overflow-hidden"
  >
    <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(33,74,157,0.08)_0%,transparent_40%)]" />
    
    <div className="flex items-start gap-6 relative z-10">
      <div className="flex-shrink-0 relative">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 group-hover:scale-110 transition-transform duration-300">
          <Icon size={28} className="text-blue-600" strokeWidth={1.8} />
        </div>
        {/* Number badge positioned at bottom-right of icon */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg border-2 border-white">
          {number}
        </div>
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 text-[15px] leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  </motion.div>
);

const FeatureHighlight = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all"
  >
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 text-white mb-4">
      <Icon size={24} strokeWidth={2} />
    </div>
    <h4 className="text-lg font-semibold text-slate-900 mb-2">{title}</h4>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            Understanding TrustFundX
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1C1E] tracking-tight mb-6">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            TrustFundX revolutionizes grant management through blockchain technology,
            milestone-based payments, and decentralized governance.
          </p>
        </motion.section>

        {/* Process Steps */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            The Complete Process
          </motion.h2>
          
          <div className="space-y-6">
            <StepCard
              number={1}
              title="Connect Your Wallet"
              desc="Students, sponsors, and voters connect their Pera Wallet to authenticate securely without passwords. Your wallet address becomes your unique identity on the platform."
              icon={Wallet}
              delay={0}
            />
            
            <StepCard
              number={2}
              title="Create or Join a Grant"
              desc="Sponsors create grants by specifying the student's wallet address, number of milestones, and required votes. The smart contract is deployed on Algorand blockchain to manage funds transparently."
              icon={CircleDollarSign}
              delay={1}
            />
            
            <StepCard
              number={3}
              title="Fund the Grant Contract"
              desc="Sponsors transfer ALGO tokens to the grant's smart contract. Funds are locked on-chain and can only be released when milestones are approved by voters, ensuring security and transparency."
              icon={Shield}
              delay={2}
            />
            
            <StepCard
              number={4}
              title="Complete Milestones"
              desc="Students work on their projects and submit milestone completions with proof-of-work (documents, reports, code). Each submission includes notes and file uploads for voter review."
              icon={FileText}
              delay={3}
            />
            
            <StepCard
              number={5}
              title="Community Voting"
              desc="Registered voters review milestone submissions and cast their approval votes on the blockchain. Each vote is recorded immutably, creating a transparent audit trail for all decisions."
              icon={Vote}
              delay={4}
            />
            
            <StepCard
              number={6}
              title="Automatic Fund Release"
              desc="When a milestone receives the required number of approvals, the smart contract automatically releases the allocated funds to the student's wallet. No intermediaries, no delays."
              icon={CheckCircle}
              delay={5}
            />
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why TrustFundX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built on blockchain technology to eliminate trust issues and ensure every transaction is transparent and verifiable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureHighlight
              title="Blockchain Verified"
              desc="Every transaction, vote, and milestone approval is permanently recorded on Algorand blockchain for complete transparency."
              icon={Shield}
            />
            <FeatureHighlight
              title="Instant Payments"
              desc="Smart contracts automatically release funds when conditions are met—no manual processing or waiting periods."
              icon={Zap}
            />
            <FeatureHighlight
              title="Real-Time Tracking"
              desc="Monitor grant progress, milestone statuses, and fund flow in real-time through intuitive dashboards."
              icon={Clock}
            />
          </div>
        </section>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join TrustFundX today and experience transparent, milestone-based grant management powered by blockchain technology.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <button className="bg-white text-blue-600 text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
                  Sign Up Now
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/login">
                <button className="border-2 border-white text-white text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </motion.section>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 TrustFundX. All rights reserved. | <Link href="/" className="hover:text-gray-700">Home</Link></p>
        </footer>
      </main>
    </div>
  );
}
