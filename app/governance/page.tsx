'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  Vote,
  Shield,
  CheckCircle,
  XCircle,
  ArrowRight,
  Users,
  FileCheck,
  Scale,
  Eye,
  Lock,
  Zap,
  AlertCircle,
  TrendingUp,
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
          if (res.ok && data.user) setUserRole(data.user.role);
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
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-black text-white w-7 h-7 flex items-center justify-center font-bold text-lg rounded-sm transform -rotate-6">
            X
          </div>
          <span className="font-semibold text-2xl tracking-tight text-black ml-2 -mt-1">TrustFundX</span>
        </Link>
        <div className="h-8 w-[1px] bg-gray-300 mx-2" />
        <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-800">
          <Link href="/how-it-works" className="hover:text-black transition-colors">How It Works</Link>
          <Link href="/sponsors-info" className="hover:text-black transition-colors">Sponsors</Link>
          <Link href="/governance" className="text-blue-600 transition-colors">Governance</Link>
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

const PrincipleCard = ({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative p-8 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group overflow-hidden"
  >
    <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.08)_0%,transparent_40%)]" />
    
    <div className={`w-16 h-16 flex items-center justify-center rounded-xl ${color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
      <Icon size={30} className="text-white" strokeWidth={2} />
    </div>
    
    <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 text-[15px] leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const VotingStep = ({ number, title, desc, icon: Icon }: { number: number, title: string, desc: string, icon: any }) => (
  <div className="flex gap-6 items-start">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg mb-2">
        {number}
      </div>
      <div className="w-[2px] h-16 bg-gradient-to-b from-blue-300 to-transparent" />
    </div>
    <div className="flex-1 pb-8">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={24} className="text-blue-600" strokeWidth={2} />
        <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatBox = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-6 rounded-xl ${color} text-white shadow-lg`}
  >
    <Icon size={32} className="mb-3 opacity-90" strokeWidth={2} />
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </motion.div>
);

export default function GovernancePage() {
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
          <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            Decentralized Governance
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1C1E] tracking-tight mb-6">
            Democracy Meets<br />Blockchain
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            TrustFundX operates as a DAO (Decentralized Autonomous Organization) where community voters ensure milestone quality and fund integrity.
          </p>
        </motion.section>

        {/* Governance Stats */}
        <section className="mb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBox
              icon={Vote}
              label="On-Chain Voting"
              value="100%"
              color="bg-gradient-to-br from-blue-600 to-blue-700"
            />
            <StatBox
              icon={Shield}
              label="Immutable Records"
              value="∞"
              color="bg-gradient-to-br from-purple-600 to-purple-700"
            />
            <StatBox
              icon={Users}
              label="Community Driven"
              value="DAO"
              color="bg-gradient-to-br from-indigo-600 to-indigo-700"
            />
            <StatBox
              icon={Eye}
              label="Transparency"
              value="Total"
              color="bg-gradient-to-br from-violet-600 to-violet-700"
            />
          </div>
        </section>

        {/* Core Principles */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Governance Principles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              TrustFundX governance is built on transparency, fairness, and community participation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PrincipleCard
              title="Transparent Voting"
              desc="Every vote is recorded permanently on the Algorand blockchain. No hidden decisions, no backroom deals—just pure transparency."
              icon={Eye}
              color="bg-blue-600"
            />
            
            <PrincipleCard
              title="Equal Voice"
              desc="Each registered voter has equal power. One wallet, one vote per milestone—ensuring fair and democratic governance."
              icon={Scale}
              color="bg-purple-600"
            />
            
            <PrincipleCard
              title="Merit-Based Approvals"
              desc="Voters review actual work submissions, documents, and proof-of-completion before approving milestone payments."
              icon={FileCheck}
              color="bg-indigo-600"
            />
            
            <PrincipleCard
              title="Immutable Audit Trail"
              desc="All voting decisions are permanently stored on-chain, creating an unalterable history of governance actions."
              icon={Lock}
              color="bg-violet-600"
            />
            
            <PrincipleCard
              title="Fast Resolution"
              desc="Smart contracts automatically execute once required votes are met—no delays, no manual processing."
              icon={Zap}
              color="bg-pink-600"
            />
            
            <PrincipleCard
              title="Community Protection"
              desc="Multiple voters prevent single-point failures. Quorum requirements protect against rushed or biased decisions."
              icon={Shield}
              color="bg-rose-600"
            />
          </div>
        </section>

        {/* Voting Process */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100"
          >
            <h2 className="text-3xl font-bold mb-3 text-center">How Voting Works</h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              The voting process is designed to be simple, transparent, and secure through blockchain technology.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <VotingStep
                number={1}
                title="Voter Registration"
                desc="Sponsors register trusted community members as voters when creating a grant. Voters must connect their Pera Wallet to participate."
                icon={Users}
              />
              
              <VotingStep
                number={2}
                title="Milestone Submission"
                desc="Students complete project milestones and submit proof-of-work including documents, code, reports, or other deliverables."
                icon={FileCheck}
              />
              
              <VotingStep
                number={3}
                title="Review & Evaluate"
                desc="Voters review submissions through their dashboard, examining notes, uploaded files, and project progress."
                icon={Eye}
              />
              
              <VotingStep
                number={4}
                title="Cast Blockchain Vote"
                desc="Voters approve or reject milestones. Each vote is a blockchain transaction signed with their wallet—permanent and verifiable."
                icon={Vote}
              />
              
              <div className="flex gap-6 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                    <CheckCircle size={28} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap size={24} className="text-green-600" strokeWidth={2} />
                    <h4 className="text-lg font-semibold text-slate-900">Automatic Execution</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">Once the required number of approvals is reached, the smart contract automatically releases funds to the student's wallet.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Protection Mechanisms */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Built-In Safeguards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Multiple layers of protection ensure fair governance and prevent abuse.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-amber-600 text-white flex-shrink-0">
                  <AlertCircle size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Anti-Double Voting</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Smart contracts prevent voters from voting twice on the same milestone. Each wallet can only submit one vote per milestone—enforced at the blockchain level.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0">
                  <Users size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Quorum Requirements</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Milestones require multiple approvals before funds are released. Sponsors set the required vote count during grant creation, ensuring distributed decision-making.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-600 text-white flex-shrink-0">
                  <Lock size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Cryptographic Security</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Every vote is signed with the voter's private key via Pera Wallet. Votes cannot be forged, modified, or disputed—they're mathematically guaranteed.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-600 text-white flex-shrink-0">
                  <TrendingUp size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Public Accountability</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    All voting activity is publicly visible on the Algorand blockchain. Anyone can audit decisions, creating natural accountability and trust.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Join Our Governance Community</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Become a voter and shape the future of student funding. Your voice matters.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <button className="bg-white text-purple-600 text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2">
                  Become a Voter
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="border-2 border-white text-white text-[15px] font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-all">
                  Learn More
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
